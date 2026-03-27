import { Activity } from "lucide-react";
import Card from "@/app/components/Card";

const Dashboard = () => {
 return (
  <div className="max-w-[1000px] w-full flex flex-col gap-8">
   <h1 className="text-4xl mb-1">Overview</h1>

   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
     <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
      Total Volume Routed
     </div>
     <div className="text-4xl font-black mt-2">₦ 18.2M</div>
    </Card>
    <Card>
     <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
      Success Rate
     </div>
     <div className="text-4xl font-black mt-2">99.8%</div>
    </Card>
    <Card>
     <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
      Active Rails
     </div>
     <div className="text-4xl font-black mt-2">4 / 4</div>
    </Card>
   </div>

   <Card className="p-12 text-center opacity-50 border-dashed">
    <Activity size={48} className="mx-auto mb-4" />
    <h2 className="text-2xl font-bold">Live Graph Coming Soon</h2>
   </Card>
  </div>
 );
};

export default Dashboard;
