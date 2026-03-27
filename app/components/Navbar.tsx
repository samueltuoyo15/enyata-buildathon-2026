"use client";

import Link from "next/link";
import Button from "./Button";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { signOut } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types";

interface NavbarProps {
 profile: Profile | null;
}

export default function Navbar({ profile }: NavbarProps) {
 const router = useRouter();
 const isUserLoggedIn = !!profile;
 const [isMenuOpen, setIsMenuOpen] = useState(false);

 const closeMenu = useCallback(() => setIsMenuOpen(false), []);
 const toggleMenu = () => setIsMenuOpen(p => !p);

 useEffect(() => {
  const handleResize = () => {
   if (window.innerWidth > 900) setIsMenuOpen(false);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
 }, []);

 useEffect(() => {
  document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
 }, [isMenuOpen]);

 useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
   if (e.key === "Escape") closeMenu();
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
 }, [closeMenu]);

 return (
  <>
   <motion.nav
    initial={{ y: -16, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="sticky top-0 z-50 flex justify-between items-center px-6 border-b border-border md:px-8 py-6 bg-white/20 backdrop-blur-md"
   >
    <Link href="/" className="flex items-center gap-2 text-2xl font-black">
     <Zap size={28} className="text-primary-dark fill-primary" />
     SENDLESS
    </Link>

    {!isUserLoggedIn && (
     <div className="hidden lg:flex gap-8 font-bold">
      <Link href="/#about">About</Link>
      <Link href="/#product">Product</Link>
      <Link href="/#pricing">Pricing</Link>
      <Link href="/#support">Support</Link>
     </div>
    )}

    <div className="hidden lg:block">
     {isUserLoggedIn ? (
      <div className="flex items-center gap-4">
       <span className="font-bold">Hi, {profile?.full_name || "User"}</span>
       <Button variant="outline" onClick={() => signOut()}>
        Logout
       </Button>
      </div>
     ) : (
      <Link href="/authenticate">
       <Button>Sign up / Login</Button>
      </Link>
     )}
    </div>

    <motion.button
     whileTap={{ scale: 0.9 }}
     onClick={toggleMenu}
     className="lg:hidden"
    >
     {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
    </motion.button>
   </motion.nav>

   {/* Mobile Menu */}
   <AnimatePresence>
    {isMenuOpen && (
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[60] flex items-center justify-center"
      onClick={closeMenu}
     >
      <motion.button
       initial={{ scale: 0.8, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       exit={{ scale: 0.8, opacity: 0 }}
       transition={{ duration: 0.15 }}
       onClick={closeMenu}
       className="absolute top-6 right-6 p-2"
      >
       <X size={28} />
      </motion.button>

      <motion.div
       initial={{ y: 20, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       exit={{ y: 20, opacity: 0 }}
       transition={{ duration: 0.2, ease: "easeOut" }}
       className={`flex flex-col gap-6 text-3xl font-black w-full px-8 ${
        isUserLoggedIn ? "text-left" : "text-center"
       }`}
       onClick={e => e.stopPropagation()}
      >
       {isUserLoggedIn ? (
        <>
         {[
          "dashboard",
          "dashboard/engine",
          "history",
          "cards",
          "identity",
          "settings"
         ].map(tab => (
          <motion.button
           key={tab}
           onClick={() => {
            router.push(`/app/${tab}`);
            closeMenu();
           }}
           className="capitalize text-left"
           whileHover={{ x: 6 }}
           whileTap={{ scale: 0.95 }}
          >
           {tab === "dashboard/engine" ? "engine" : tab}
          </motion.button>
         ))}

         <Button className="w-full mt-8" onClick={async () => await signOut()}>
          Sign out
         </Button>
        </>
       ) : (
        <>
         {[
          ["About", "#about"],
          ["Product", "#product"],
          ["Pricing", "#pricing"],
          ["Support", "#support"]
         ].map(([label, href]) => (
          <Link
           key={label}
           href={href}
           onClick={closeMenu}
           className="contents"
          >
           <motion.span whileHover={{ x: 6 }} whileTap={{ scale: 0.95 }}>
            {label}
           </motion.span>
          </Link>
         ))}

         <Link href="/authenticate" onClick={closeMenu}>
          <Button className="w-full mt-8">Sign up / Login</Button>
         </Link>
        </>
       )}
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>
  </>
 );
}
