"use server";

import { createClient } from "@/lib/supabase/server";
import type { ExecuteTransferParams, TransferResult } from "@/lib/types";

async function getInterswitchToken(): Promise<string> {
 const credentials = Buffer.from(
  `${process.env.INTERSWITCH_CLIENT_ID}:${process.env.INTERSWITCH_CLIENT_SECRET}`
 ).toString("base64");

 const res = await fetch(
  `${process.env.INTERSWITCH_BASE_URL}/passport/oauth/token`,
  {
   method: "POST",
   headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded"
   },
   body: "grant_type=client_credentials"
  }
 );

 const data = await res.json();
 return data.access_token;
}

export async function executeTransfer(
 params: ExecuteTransferParams
): Promise<TransferResult> {
 const supabase = await createClient();
 const {
  data: { user }
 } = await supabase.auth.getUser();

 if (!user) {
  return { success: false, error: "Unauthorized" };
 }

 const { data: transfer, error: insertError } = await supabase
  .from("transfers")
  .insert({
   user_id: user.id,
   from_country: params.fromCountry,
   to_country: params.toCountry,
   amount: params.amount,
   priority: params.priority,
   selected_route: params.selectedRoute.type,
   fee: params.selectedRoute.fee,
   fx_rate: params.selectedRoute.fxRate,
   settlement_estimate: params.selectedRoute.speedMinutes,
   status: "processing",
   recipient_name: params.recipientName,
   recipient_account: params.recipientAccount,
   recipient_bank_code: params.recipientBankCode
  })
  .select()
  .single();

 if (insertError || !transfer) {
  return { success: false, error: "Failed to create transfer record" };
 }

 await supabase.from("route_comparisons").insert(
  params.allRoutes.map(route => ({
   transfer_id: transfer.id,
   route_type: route.type,
   fee: route.fee,
   speed_minutes: route.speedMinutes,
   reliability_score: route.reliabilityScore,
   fx_rate: route.fxRate,
   final_score: route.finalScore,
   is_winner: route.isWinner
  }))
 );

 try {
  const token = await getInterswitchToken();

  const interswitchRes = await fetch(
   `${process.env.INTERSWITCH_BASE_URL}/api/v3/quickteller/transfers`,
   {
    method: "POST",
    headers: {
     Authorization: `Bearer ${token}`,
     "Content-Type": "application/json"
    },
    body: JSON.stringify({
     beneficiaryAccountNumber: params.recipientAccount,
     beneficiaryBankCode: params.recipientBankCode,
     beneficiaryName: params.recipientName,
     amount: Math.round(params.amount * 100),
     currencyCode: "566",
     transferCode: `SL_${transfer.id.replace(/-/g, "").slice(0, 16)}`,
     narration: `SendLess via ${params.selectedRoute.label}`
    })
   }
  );

  const interswitchData = await interswitchRes.json();
  const reference =
   interswitchData.transactionReference || interswitchData.transferCode;

  await supabase
   .from("transfers")
   .update({ status: "completed", interswitch_reference: reference })
   .eq("id", transfer.id);

  return {
   success: true,
   transferId: transfer.id,
   interswitchReference: reference
  };
 } catch {
  await supabase
   .from("transfers")
   .update({ status: "failed" })
   .eq("id", transfer.id);

  return { success: false, error: "Transfer execution failed" };
 }
}

export async function getTransferStatus(reference: string) {
 const token = await getInterswitchToken();

 const res = await fetch(
  `${process.env.INTERSWITCH_BASE_URL}/api/v3/quickteller/transactions/${reference}`,
  {
   headers: { Authorization: `Bearer ${token}` }
  }
 );

 return res.json();
}
