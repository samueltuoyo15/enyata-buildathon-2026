"use client";

import { useState } from "react";
import { RefreshCw, Layers, CheckCircle2 } from "lucide-react";

import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import {
 TransferDetails,
 SystemActivity,
 RouteEvaluation,
 CheckoutModal
} from "@/app/components/dashboard";

import { runRoutingEngine } from "@/app/actions/routing";
import { executeTransfer } from "@/app/actions/transfer";
import type {
 EngineState,
 PaymentRoute,
 CountryOption,
 PriorityOption,
 CurrencyCode
} from "@/app/types";
import type { ScoredRoute, Priority } from "@/lib/types";

const COUNTRIES: CountryOption[] = [
 { country: "Nigeria", code: "NG", currency: "NGN" },
 { country: "United States", code: "US", currency: "USD" },
 { country: "United Kingdom", code: "UK", currency: "GBP" },
 { country: "Ghana", code: "GH", currency: "GHS" }
];

const STEPS = [
 "Discovering routes...",
 "Fetching FX rates...",
 "Calculating fees...",
 "Estimating transfer speed...",
 "Scoring routes..."
];

const formatSpeed = (minutes: number): string => {
 if (minutes < 60) return `${minutes} mins`;
 if (minutes < 1440) return `${Math.round(minutes / 60)} hours`;
 return `${Math.round(minutes / 1440)} days`;
};

const Engine = () => {
 const [engineState, setEngineState] = useState<EngineState>("input");
 const [sourceCountry, setSourceCountry] = useState<CountryOption>(
  COUNTRIES[0]
 );
 const [targetCountry, setTargetCountry] = useState<CountryOption>(
  COUNTRIES[1]
 );
 const [amount, setAmount] = useState("0");
 const [priority, setPriority] = useState<PriorityOption>("cheapest");
 const [recipientName, setRecipientName] = useState("");
 const [recipientAccount, setRecipientAccount] = useState("");
 const [recipientBankCode, setRecipientBankCode] = useState("");
 const [analysisStep, setAnalysisStep] = useState(0);
 const [routes, setRoutes] = useState<PaymentRoute[]>([]);
 const [rawScoredRoutes, setRawScoredRoutes] = useState<ScoredRoute[]>([]);

 const runAnalysis = () => {
  setEngineState("analyzing");
  setAnalysisStep(0);
  const serverActionPromise = runRoutingEngine({
   amount: Number(amount),
   priority: priority as Priority,
   fromCountry: sourceCountry.currency as CurrencyCode,
   toCountry: targetCountry.currency as CurrencyCode
  });
  let currentStep = 0;
  const interval = setInterval(async () => {
   currentStep++;
   if (currentStep < STEPS.length) {
    setAnalysisStep(currentStep);
   } else {
    clearInterval(interval);
    const scored = await serverActionPromise;
    if (!scored) {
     setEngineState("input");
     return;
    }
    setRawScoredRoutes(scored);
    const finalRoutes: PaymentRoute[] = scored.map(route => ({
     id: route.type,
     name: route.label,
     fee: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: sourceCountry.currency,
      maximumFractionDigits: 0
     }).format(route.fee),
     time: formatSpeed(route.speedMinutes),
     status: route.isWinner ? "winner" : "eliminated",
     reason: route.eliminationReason || (route.isWinner ? "Optimal match" : "")
    }));
    setRoutes(finalRoutes);
    setTimeout(() => setEngineState("result"), 500);
   }
  }, 800);
 };

 const executeTransferAndFinish = async () => {
  const winner = rawScoredRoutes.find(r => r.isWinner);
  if (!winner) return;
  setEngineState("executing");
  const result = await executeTransfer({
   amount: Number(amount),
   fromCountry: sourceCountry.currency,
   toCountry: targetCountry.currency,
   priority: priority as Priority,
   selectedRoute: winner,
   allRoutes: rawScoredRoutes,
   recipientName,
   recipientAccount,
   recipientBankCode
  });
  if (result.success) {
   setEngineState("success");
  } else {
   setEngineState("result");
  }
 };

 const showResults = [
  "analyzing",
  "result",
  "checkout",
  "executing",
  "success"
 ].includes(engineState);

 return (
  <div className="max-w-[1100px] w-full flex flex-col gap-8">
   <div className="flex justify-between items-center flex-wrap gap-4">
    <div>
     <h1 className="text-4xl text-left font-black italic">Routing Engine</h1>
     <p className="text-text-muted font-bold">
      Cross-border liquidity optimization.
     </p>
    </div>
    {engineState !== "input" && (
     <Button
      variant="secondary"
      onClick={() => setEngineState("input")}
      icon={<RefreshCw size={18} />}
     >
      New Quote
     </Button>
    )}
   </div>
   <div className="flex gap-8 flex-wrap">
    <div className="flex-1 min-w-[340px] flex flex-col gap-8">
     <TransferDetails
      engineState={engineState}
      sourceCountry={sourceCountry}
      targetCountry={targetCountry}
      amount={amount}
      priority={priority}
      countries={COUNTRIES}
      onSourceChange={setSourceCountry}
      onTargetChange={setTargetCountry}
      onAmountChange={setAmount}
      onPriorityChange={setPriority}
      onRunAnalysis={runAnalysis}
     />
     <SystemActivity
      engineState={engineState}
      analysisStep={analysisStep}
      steps={STEPS}
     />
    </div>
    <div className="flex-[1.5] min-w-[340px] flex flex-col gap-4">
     {engineState === "input" && (
      <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-border rounded-brutal p-12 text-center bg-white/50">
       <Layers size={48} className="mb-4 opacity-30" />
       <h3 className="text-2xl font-black">Awaiting Params</h3>
       <p className="text-text-muted mt-2 font-bold max-w-xs">
        Configure source, destination and priority.
       </p>
      </div>
     )}
     {showResults && <RouteEvaluation routes={routes} />}
     {engineState === "result" && (
      <Card className="bg-primary mt-4 border-4 border-black shadow-brutal">
       <div className="mb-6">
        <div className="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-2 py-1 mb-3">
         Optimization Match Found
        </div>
        <h2 className="text-3xl font-black mb-2">Ready to Route</h2>
        <p className="font-bold text-lg">
         Route matches your <span className="underline">{priority}</span>{" "}
         preference.
        </p>
       </div>
       <Button
        className="w-full text-xl py-6 border-4 border-black"
        onClick={() => setEngineState("checkout")}
       >
        Execute Transfer
       </Button>
      </Card>
     )}
     {["checkout", "executing"].includes(engineState) && (
      <Card className="bg-white text-center py-16 px-8 mt-4 border-4 border-black">
       <RefreshCw
        size={64}
        className="animate-spin mx-auto mb-6 text-primary-dark"
       />
       <h2 className="text-3xl font-black italic uppercase">
        Processing Rail...
       </h2>
       <p className="font-bold text-text-muted mt-2">
        Locking FX Rate and Initiating Settlement...
       </p>
      </Card>
     )}
     {engineState === "success" && (
      <Card className="bg-success text-white text-center py-16 px-8 mt-4 border-4 border-black">
       <CheckCircle2 size={80} className="mx-auto mb-6" />
       <h2 className="text-4xl font-black mb-4">RAIL SUCCESS!</h2>
       <p className="font-bold italic">
        Settlement reached via {priority} optimization.
       </p>
      </Card>
     )}
    </div>
   </div>
   {engineState === "checkout" && (
    <CheckoutModal
     amount={amount}
     currency={sourceCountry.currency}
     recipientName={recipientName}
     recipientAccount={recipientAccount}
     recipientBankCode={recipientBankCode}
     onNameChange={setRecipientName}
     onAccountChange={setRecipientAccount}
     onBankChange={setRecipientBankCode}
     onClose={() => setEngineState("result")}
     onExecute={executeTransferAndFinish}
    />
   )}
  </div>
 );
};

export default Engine;
