"use server";

import { createClient } from "@/lib/supabase/server";
import type { TransferWithRoutes } from "@/lib/types";

export async function getUserTransfers(page = 1) {
 const supabase = await createClient();
 const {
  data: { user }
 } = await supabase.auth.getUser();

 if (!user) return { data: [], count: 0 };

 const limit = 10;
 const offset = (page - 1) * limit;

 const { data, count, error } = await supabase
  .from("transfers")
  .select("*", { count: "exact" })
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .range(offset, offset + limit - 1);

 if (error) return { data: [], count: 0 };

 return { data: data ?? [], count: count ?? 0 };
}

export async function getTransferById(
 id: string
): Promise<TransferWithRoutes | null> {
 const supabase = await createClient();
 const {
  data: { user }
 } = await supabase.auth.getUser();

 if (!user) return null;

 const { data: transfer } = await supabase
  .from("transfers")
  .select("*")
  .eq("id", id)
  .eq("user_id", user.id)
  .single();

 if (!transfer) return null;

 const { data: routes } = await supabase
  .from("route_comparisons")
  .select("*")
  .eq("transfer_id", id)
  .order("final_score", { ascending: true });

 return { ...transfer, routes: routes ?? [] };
}
