"use client";

import { XCircle, Zap, User, Landmark, Hash } from "lucide-react";
import Button from "@/app/components/Button";

interface CheckoutModalProps {
 amount: string;
 currency: string;
 recipientName: string;
 recipientAccount: string;
 recipientBankCode: string;
 onNameChange: (val: string) => void;
 onAccountChange: (val: string) => void;
 onBankChange: (val: string) => void;
 onClose: () => void;
 onExecute: () => void;
}

const CheckoutModal = ({
 amount,
 currency,
 recipientName,
 recipientAccount,
 recipientBankCode,
 onNameChange,
 onAccountChange,
 onBankChange,
 onClose,
 onExecute
}: CheckoutModalProps) => {
 const symbol = currency === "NGN" ? "₦" : "$";
 const fee = Number(amount) * 0.005;
 const total = Number(amount) + fee;

 return (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
   <div className="w-full max-w-[500px] bg-white relative p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <button
     onClick={onClose}
     className="absolute top-6 right-6 text-black hover:rotate-90 transition-transform"
    >
     <XCircle size={32} />
    </button>
    <div className="text-center mb-8">
     <div className="text-2xl font-black flex items-center justify-center gap-2 mb-2 italic">
      <Zap size={28} className="fill-primary text-black" />
      FINAL SETTLEMENT
     </div>
     <p className="text-text-muted text-sm font-bold uppercase tracking-widest">
      Funding Rail Configuration
     </p>
    </div>
    <div className="flex flex-col gap-4 mb-6">
     <div className="grid grid-cols-1 gap-4">
      <div className="relative">
       <User className="absolute left-3 top-9 text-text-muted" size={18} />
       <label className="block text-[10px] font-black mb-1 uppercase tracking-widest">
        Recipient Full Name
       </label>
       <input
        value={recipientName}
        onChange={e => onNameChange(e.target.value)}
        type="text"
        className="brutal-input w-full !pl-10"
        placeholder="John Doe"
       />
      </div>
      <div className="grid grid-cols-2 gap-4">
       <div className="relative">
        <Hash className="absolute left-3 top-9 text-text-muted" size={18} />
        <label className="block text-[10px] font-black mb-1 uppercase tracking-widest">
         Account Number
        </label>
        <input
         value={recipientAccount}
         onChange={e => onAccountChange(e.target.value)}
         type="text"
         className="brutal-input w-full !pl-10"
         placeholder="0123456789"
        />
       </div>
       <div className="relative">
        <Landmark className="absolute left-3 top-9 text-text-muted" size={18} />
        <label className="block text-[10px] font-black mb-1 uppercase tracking-widest">
         Bank Code
        </label>
        <input
         value={recipientBankCode}
         onChange={e => onBankChange(e.target.value)}
         type="text"
         className="brutal-input w-full !pl-10"
         placeholder="044"
        />
       </div>
      </div>
     </div>
    </div>
    <div className="bg-primary/10 p-6 border-4 border-black mb-8">
     <div className="flex justify-between mb-2 font-bold text-sm">
      <span>Transfer Principal</span>
      <span>
       {symbol} {Number(amount).toLocaleString()}
      </span>
     </div>
     <div className="flex justify-between mb-2 font-bold text-sm">
      <span>Optimization Fee (0.5%)</span>
      <span>
       {symbol} {fee.toLocaleString()}
      </span>
     </div>
     <div className="flex justify-between pt-4 border-t-4 border-black mt-4">
      <span className="font-black italic">TOTAL SETTLEMENT</span>
      <span className="font-black text-2xl">
       {symbol} {total.toLocaleString()}
      </span>
     </div>
    </div>
    <Button
     variant="primary"
     className="w-full text-2xl py-6 border-4 border-black shadow-brutal active:shadow-none transition-all"
     onClick={onExecute}
    >
     AUTHORIZE RAIL
    </Button>
   </div>
  </div>
 );
};

export default CheckoutModal;
