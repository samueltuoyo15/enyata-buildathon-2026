import { CheckCircle2, XCircle, Info } from "lucide-react";
import Card from "@/app/components/Card";
import type { PaymentRoute } from "@/app/types";

interface RouteEvaluationProps {
 routes: PaymentRoute[];
}

const RouteEvaluation = ({ routes }: RouteEvaluationProps) => {
 return (
  <>
   <h2 className="text-xl font-bold mb-2 italic uppercase tracking-tighter">
    Route Evaluation
   </h2>
   <div className="flex flex-col gap-4">
    {routes.map(route => {
     const isEliminated = route.status === "eliminated";
     const isWinner = route.status === "winner";
     const isEvaluating = route.status === "evaluating";

     return (
      <Card
       key={route.id}
       className={`transition-all duration-500 border-4 ${
        isEliminated
         ? "opacity-40 grayscale blur-[0.5px] bg-gray-100"
         : "bg-white"
       } ${isWinner ? "border-black bg-primary scale-[1.02] shadow-brutal" : "border-border"}`}
      >
       <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex-1">
         <h3 className="text-lg font-black flex items-center gap-2 uppercase">
          {route.name}
          {isWinner && (
           <CheckCircle2 size={20} className="fill-black text-primary" />
          )}
          {isEliminated && <XCircle size={18} className="text-text-muted" />}
          {isEvaluating && (
           <div className="w-2 h-2 bg-primary-dark animate-ping rounded-full" />
          )}
         </h3>

         {route.reason && (
          <div
           className={`text-xs mt-2 font-black px-2 py-1 inline-block border-2 border-black ${
            isWinner ? "bg-white text-black" : "bg-black text-white"
           }`}
          >
           {isWinner ? "OPTIMAL: " : "REJECTED: "} {route.reason}
          </div>
         )}
        </div>
        <div className="text-right">
         <div className="text-2xl font-black leading-none">{route.fee}</div>
         <div className="text-[10px] font-black uppercase text-text-muted mt-1">
          {route.time} EST.
         </div>
        </div>
       </div>
      </Card>
     );
    })}
   </div>
  </>
 );
};

export default RouteEvaluation;
