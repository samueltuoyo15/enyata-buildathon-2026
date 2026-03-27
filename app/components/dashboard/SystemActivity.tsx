import { CheckCircle2, RefreshCw } from "lucide-react";
import Card from "@/app/components/Card";
import type { EngineState } from "@/app/types";

interface SystemActivityProps {
 engineState: EngineState;
 analysisStep: number;
 steps: string[];
}

const SystemActivity = ({
 engineState,
 analysisStep,
 steps
}: SystemActivityProps) => {
 if (engineState === "input") return null;

 return (
  <Card className="bg-white border-4 border-black">
   <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">
    System Logs
   </h3>
   <div className="flex flex-col gap-3">
    {steps.map((step, idx) => {

     const isFinished = ["result", "checkout", "executing", "success"].includes(
      engineState
     );
     const isPast = isFinished || idx < analysisStep;
     const isActive = engineState === "analyzing" && idx === analysisStep;

     return (
      <div
       key={step}
       className={`flex items-center gap-3 transition-opacity duration-300 ${
        isActive || isPast ? "opacity-100" : "opacity-20"
       }`}
      >
       {isPast ? (
        <CheckCircle2 size={16} className="text-success fill-success/20" />
       ) : isActive ? (
        <RefreshCw size={16} className="animate-spin text-primary-dark" />
       ) : (
        <div className="w-4 h-4 rounded-full border-2 border-black/20"></div>
       )}
       <span className={`text-sm ${isActive ? "font-black" : "font-bold"}`}>
        {step}
       </span>
      </div>
     );
    })}
   </div>
  </Card>
 );
};

export default SystemActivity;
