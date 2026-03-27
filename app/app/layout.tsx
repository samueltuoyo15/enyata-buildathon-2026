import Sidebar from "@/app/components/Sidebar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
 return (
  <div className="min-h-screen flex flex-col bg-bg font-sans">
   <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 w-full p-4 md:p-10 overflow-y-auto">
     {children}
    </main>
   </div>
  </div>
 );
}
