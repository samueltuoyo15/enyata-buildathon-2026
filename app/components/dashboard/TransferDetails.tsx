"use client";

import { ArrowRight, Search, Zap, Clock, ShieldCheck } from "lucide-react";

import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import CustomDropdown from "@/app/components/CustomDropdown";

import type { EngineState, CountryOption, PriorityOption } from "@/app/types";

interface TransferDetailsProps {
 engineState: EngineState;
 sourceCountry: CountryOption;
 targetCountry: CountryOption;
 amount: string;
 priority: PriorityOption;
 countries: CountryOption[];
 onSourceChange: (option: CountryOption) => void;
 onTargetChange: (option: CountryOption) => void;
 onAmountChange: (val: string) => void;
 onPriorityChange: (p: PriorityOption) => void;
 onRunAnalysis: () => void;
}

const TransferDetails = ({
 engineState,
 sourceCountry,
 targetCountry,
 amount,
 priority,
 countries,
 onSourceChange,
 onTargetChange,
 onAmountChange,
 onPriorityChange,
 onRunAnalysis
}: TransferDetailsProps) => {
 const isLocked = engineState !== "input";

 const getCurrencySymbol = (currencyCode: string) => {
  try {
   return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode
   })
    .format(0)
    .replace(/\d| |\./g, "");
  } catch {
   return "$";
  }
 };

 return (
  <Card className="border-4 border-black">
   <h2 className="text-xl mb-6 flex items-center gap-2 font-black uppercase tracking-tighter">
    <ArrowRight size={20} strokeWidth={3} /> Transfer Parameters
   </h2>

   <div className="flex flex-col gap-6">
    <div className="grid grid-cols-2 gap-4">
     <CustomDropdown<CountryOption>
      label="Source"
      disabled={isLocked}
      options={countries}
      selected={sourceCountry}
      keyExtractor={c => c.code}
      onChange={onSourceChange}
      renderSelected={c => (
       <div className="flex items-center gap-2">
        <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-black leading-none">
         {c.code}
        </span>
        <span className="truncate font-bold">{c.country}</span>
       </div>
      )}
      renderItem={c => (
       <div className="flex flex-col">
        <span className="text-sm font-black">{c.country}</span>
        <span className="text-[10px] opacity-60 uppercase font-bold tracking-tight">
         {c.currency} Network
        </span>
       </div>
      )}
     />

     <CustomDropdown<CountryOption>
      label="Target"
      disabled={isLocked}
      options={countries}
      selected={targetCountry}
      keyExtractor={c => c.code}
      onChange={onTargetChange}
      renderSelected={c => (
       <div className="flex items-center gap-2">
        <span className="bg-secondary border border-black px-1.5 py-0.5 text-[10px] font-black leading-none">
         {c.code}
        </span>
        <span className="truncate font-bold">{c.country}</span>
       </div>
      )}
      renderItem={c => (
       <div className="flex flex-col">
        <span className="text-sm font-black">{c.country}</span>
        <span className="text-[10px] opacity-60 uppercase font-bold tracking-tight">
         {c.currency} Rail
        </span>
       </div>
      )}
     />
    </div>

    <div>
     <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-text-muted">
      Amount to Send
     </label>
     <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl pointer-events-none">
       {getCurrencySymbol(sourceCountry.currency)}
      </span>
      <input
       type="text"
       inputMode="numeric"
       className="brutal-input !pl-16 text-lg font-black"
       value={amount ? Number(amount).toLocaleString() : ""}
       onChange={e => {
        const raw = e.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
        onAmountChange(raw);
       }}
       disabled={isLocked}
       placeholder="0"
      />
     </div>
    </div>

    <div>
     <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-text-muted">
      Optimization Priority
     </label>
     <div className="grid grid-cols-3 gap-3">
      {[
       { id: "cheapest", icon: <Zap size={20} />, label: "Cheapest" },
       { id: "fastest", icon: <Clock size={20} />, label: "Fastest" },
       { id: "safest", icon: <ShieldCheck size={20} />, label: "Safest" }
      ].map(opt => {
       const isActive = priority === opt.id;
       return (
        <button
         key={opt.id}
         type="button"
         disabled={isLocked}
         onClick={() => onPriorityChange(opt.id as PriorityOption)}
         className={`flex flex-col items-center justify-center p-4 border-4 border-black transition-all ${
          isActive
           ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
           : "bg-white opacity-60 hover:opacity-100 hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
         } disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
        >
         <div className={`${isActive ? "scale-110" : ""} transition-transform`}>
          {opt.icon}
         </div>
         <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">
          {opt.label}
         </span>
        </button>
       );
      })}
     </div>
    </div>

    {engineState === "input" && (
     <Button
      variant="primary"
      className="mt-2 w-full text-xl py-6 border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      onClick={onRunAnalysis}
      icon={<Search size={24} strokeWidth={3} />}
     >
      Find Optimized Route
     </Button>
    )}
   </div>
  </Card>
 );
};

export default TransferDetails;
