"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
 LayoutDashboard,
 Layers,
 History,
 CreditCard,
 UserCheck,
 Settings,
 LogOut
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

const NAV_ITEMS = [
 { label: "MENU", isHeader: true },
 { href: "/app/dashboard", icon: LayoutDashboard, label: "Dashbord" },
 { href: "/app/dashboard/engine", icon: Layers, label: "Routing Engine" },
 { href: "/app/history", icon: History, label: "Transaction History" },
 { label: "Other Services", isHeader: true, className: "mt-6" },
 { href: "/app/cards", icon: CreditCard, label: "Virtual Cards" },
 { href: "/app/identity", icon: UserCheck, label: "Identity (KYC)" }
];

export default function Sidebar() {
 const pathname = usePathname();

 return (
  <aside className="hidden lg:flex w-[260px] bg-white border-r-brutal border-border p-8 flex-col gap-4 overflow-y-auto">
   <div className="flex flex-col gap-3 flex-1">
    {NAV_ITEMS.map((item, idx) => {
     if (item.isHeader) {
      return (
       <div
        key={`header-${idx}`}
        className={`font-black text-xs text-text-muted mb-2 tracking-widest uppercase ${item.className || ""}`}
       >
        {item.label}
       </div>
      );
     }

     const isActive = pathname === item.href;

     return (
      <Link
       key={item.href}
       href={item.href}
       className={`flex items-center gap-4 w-full p-3 font-bold text-sm tracking-wide transition-all rounded-brutal ${
        isActive
         ? "bg-primary border-brutal border-border shadow-brutal-sm"
         : "bg-transparent text-text-main hover:bg-gray-100 hover:translate-x-1"
       }`}
      >
       <item.icon size={20} />
       {item.label}
      </Link>
     );
    })}
   </div>

   <div className="flex flex-col gap-3 mt-4 pt-4 border-t-2 border-dashed border-border">
    <Link
     href="/app/settings"
     className={`flex items-center gap-4 w-full p-3 font-bold text-sm tracking-wide transition-all rounded-brutal ${
      pathname === "/app/settings"
       ? "bg-primary border-brutal border-border shadow-brutal-sm"
       : "bg-transparent text-text-main hover:bg-gray-100 hover:translate-x-1"
     }`}
    >
     <Settings size={20} />
     Settings
    </Link>

    <button
     onClick={async () => await signOut()}
     className="flex items-center gap-4 w-full p-3 font-bold text-sm tracking-wide text-error hover:bg-red-50 hover:translate-x-1 rounded-brutal"
    >
     <LogOut size={20} />
     Sign out
    </button>
   </div>
  </aside>
 );
}
