"use client";

import Link from "next/link";
import Button from "@/app/components/Button";
import { ArrowUpRight, Zap, Target, Activity, CheckCircle } from "lucide-react";
import {
 motion,
 useMotionValue,
 useSpring,
 useTransform,
 useScroll,
 type Variants
} from "motion/react";

const fadeUp = {
 hidden: { opacity: 0, y: 30 },
 show: {
  opacity: 1,
  y: 0,
  transition: { duration: 0.6, ease: "easeOut" }
 }
} satisfies Variants;

const fadeIn = {
 hidden: { opacity: 0 },
 show: {
  opacity: 1,
  transition: { duration: 0.5, ease: "easeOut" }
 }
} satisfies Variants;

function TiltWrap({
 children,
 className = ""
}: {
 children: React.ReactNode;
 className?: string;
}) {
 const x = useMotionValue(0);
 const y = useMotionValue(0);

 const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), {
  stiffness: 150,
  damping: 15
 });

 const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), {
  stiffness: 150,
  damping: 15
 });

 function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  x.set(e.clientX - centerX);
  y.set(e.clientY - centerY);
 }

 function handleMouseLeave() {
  x.set(0);
  y.set(0);
 }

 return (
  <motion.div
   className={className}
   style={{ rotateX, rotateY, transformPerspective: 900 }}
   onMouseMove={handleMouseMove}
   onMouseLeave={handleMouseLeave}
   whileTap={{ scale: 0.96 }}
  >
   {children}
  </motion.div>
 );
}

export default function Landing() {
 const { scrollYProgress } = useScroll();
 const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

 const features = [
  {
   icon: <Activity size={32} />,
   title: "Live Execution Scoring",
   text:
    "We analyze live FX spread, liquidity, and latency of networks before transferring your funds."
  },
  {
   icon: <Zap size={32} />,
   title: "Interswitch Integrated",
   text:
    "Direct APIs linked directly into leading infrastructure such as Interswitch to provide card rail processing."
  },
  {
   icon: <CheckCircle size={32} />,
   title: "Maximum Cost Savings",
   text:
    "Eliminate hidden fees by routing your transaction over the rail with the best conditions right now."
  }
 ];

 return (
  <div className="min-h-screen flex flex-col">
   <motion.section
    className="bg-gradient-mesh min-h-screen flex flex-col"
    initial="hidden"
    animate="show"
    variants={fadeIn}
   >
    <motion.div
     style={{ y: heroY }}
     className="hero-container flex-1 flex items-center justify-center p-8 gap-16 max-w-[1200px] mx-auto w-full"
    >
     <motion.div
      className="flex-1 mt-5"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
     >
      <motion.h1
       className="hero-title text-[4.5rem] leading-[1.1] tracking-[-0.03em] mb-16 relative z-10"
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.7 }}
      >
       Payment routing
       <br />
       easier and faster
      </motion.h1>

      <motion.div
       className="mt-4 abstract-cards-wrapper relative h-[300px] w-full max-w-[500px]"
       initial={{ opacity: 0, scale: 0.95 }}
       whileInView={{ opacity: 1, scale: 1 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6, delay: 0.2 }}
      >
       <motion.div
        className="brutal-card absolute top-10 left-10 w-[270px] md:w-[320px] h-[180px] !bg-blue-300 z-[1]"
        initial={{ rotate: 6, y: 10 }}
        animate={{ rotate: 8, y: [10, 0, 10] }}
        transition={{
         duration: 4,
         repeat: Infinity,
         ease: "easeInOut"
        }}
        whileHover={{ rotate: -6, y: -8, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
       >
        <div className="flex justify-end h-full flex-col">
         <div className="text-xl font-extrabold">VISA</div>
         <div className="text-sm">CREDIT</div>
        </div>
       </motion.div>

       <motion.div
        className="brutal-card absolute top-0 left-0 w-[290px] md:w-[320px] h-[180px] !bg-surface z-[2] flex flex-col justify-between"
        initial={{ rotate: -2 }}
        animate={{ rotate: [-2, 1, -2] }}
        transition={{
         duration: 5,
         repeat: Infinity,
         ease: "easeInOut"
        }}
        whileHover={{ rotate: 3, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
       >
        <div className="flex justify-between">
         <div className="w-10 h-[30px] bg-gray-300 rounded"></div>
         <div className="text-xl font-extrabold text-right">
          VISA
          <br />
          <span className="text-xs">CREDIT</span>
         </div>
        </div>
        <div className="text-lg tracking-[2px] font-semibold">
         **** **** **** 9999
        </div>
        <div className="text-sm font-semibold uppercase">Tunde Ednut</div>
       </motion.div>
       <motion.div
        className="brutal-card absolute top-[-20px] right-10 w-[50px] h-[50px] !rounded-full flex items-center justify-center !bg-primary p-0 text-3xl font-extrabold z-[3]"
        whileHover={{ rotate: 20, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
       >
        ₿
       </motion.div>
      </motion.div>
     </motion.div>

     <motion.div
      className="flex-none w-[350px] md:w-[400px] pl-4 mt-10 md:mt-0 md:-mt-16"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
     >
      <div className="stats-container flex gap-8 mb-12">
       <motion.div
        whileHover={{ scale: 1.08, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
       >
        <div className="text-[2.5rem] font-black">6K+</div>
        <div className="text-sm font-semibold">Satisfied Customers</div>
       </motion.div>

       <motion.div
        whileHover={{ scale: 1.08, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
       >
        <div className="text-[2.5rem] font-black">150+</div>
        <div className="text-sm font-semibold">Financial Services</div>
       </motion.div>
      </div>

      <div className="text-sm font-extrabold tracking-[1px] mb-4 border-b-2 border-border pb-2 inline-block">
       FINANCIAL ROUTING
      </div>

      <p className="mb-8 font-medium leading-[1.6]">
       We provide an intelligent payment routing engine to support your
       cross-border transfers. Our platform evaluates multiple financial rails
       including banks, cards, wallets, and crypto to execute the fastest and
       cheapest transaction.
      </p>

      <div className="flex items-center gap-6 flex-wrap">
       <Link href="/authenticate">
        <motion.div whileTap={{ scale: 0.95 }}>
         <Button variant="primary" className="px-8 py-4">
          Try for free
         </Button>
        </motion.div>
       </Link>

       <motion.a
        href="#product"
        className="flex items-center gap-2 font-semibold cursor-pointer"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.95 }}
       >
        <motion.div
         className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center"
         whileHover={{ rotate: 45 }}
        >
         <ArrowUpRight size={20} />
        </motion.div>
        How it works
       </motion.a>
      </div>
     </motion.div>
    </motion.div>
   </motion.section>

   <motion.section
    id="about"
    className="py-24 px-8 bg-white border-t-brutal border-border"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    variants={fadeUp}
   >
    <div className="about-container max-w-[1200px] mx-auto flex gap-16 items-center">
     <div className="flex-1">
      <h2 className="text-5xl mb-6">About SendLess</h2>
      <p className="text-text-muted mb-4 md:text-lg">
       We discovered that cross-border payments are broken because apps lock you
       into a single payment rail. If the SWIFT network is expensive today, you
       have no choice but to pay.
      </p>
      <p className="text-text-muted mb-8 md:text-lg">
       SendLess operates differently. We are an intelligent abstraction layer.
       We calculate the best route for your payment—whether that's a bank
       transfer, via a card processing rail like Interswitch, over a FinTech
       wallet, or through a crypto bridge.
      </p>
     </div>

     <TiltWrap className="flex-1 w-full">
      <motion.div
       className="brutal-card bg-[#E6E6FA]"
       initial={{ opacity: 0, y: 30 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       whileHover={{ y: -6 }}
      >
       <h3 className="text-2xl mb-4 flex items-center gap-4">
        <motion.div whileHover={{ rotate: 15 }}>
         <Target size={40} fill="#a8ff53" />
        </motion.div>
        The Engine Mentality
       </h3>
       <p className="font-medium">
        Do not think of us as a bank. Think of us as Google Maps for your money.
        You input the destination, we give you the fastest, safest, and cheapest
        route.
       </p>
      </motion.div>
     </TiltWrap>
    </div>
   </motion.section>

   <section
    id="product"
    className="py-24 px-8 bg-bg border-t-brutal border-border"
   >
    <div className="max-w-[1200px] mx-auto">
     <div className="text-center mb-16">
      <h2 className="text-5xl mb-4">Our Core Features</h2>
      <p className="text-lg text-text-muted">
       How the routing engine dominates the market.
      </p>
     </div>

     <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
      {features.map((f, i) => (
       <TiltWrap key={i} className="brutal-card flex flex-col gap-4 p-4">
        <motion.div
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, amount: 0.2 }}
         transition={{ duration: 0.5, delay: i * 0.1 }}
         whileHover={{ y: -10 }}
        >
         <motion.div
          className="w-[60px] h-[60px] bg-primary flex items-center justify-center rounded-full border border-border"
          whileHover={{ rotate: 20, scale: 1.1 }}
         >
          {f.icon}
         </motion.div>
         <h3 className="text-2xl">{f.title}</h3>
         <p className="text-text-muted">{f.text}</p>
        </motion.div>
       </TiltWrap>
      ))}
     </div>
    </div>
   </section>

   <motion.section
    id="pricing"
    className="py-24 px-8 bg-white border-t-brutal border-border"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    variants={fadeUp}
   >
    <div className="max-w-[1200px] mx-auto text-center">
     <h2 className="text-5xl mb-4">Transparent Pricing</h2>
     <p className="text-lg text-text-muted mb-12">
      We only charge a tiny optimization fee. The rest goes straight to the rail
      processor.
     </p>

     <TiltWrap className="brutal-card pricing-card max-w-[500px] mx-auto p-12 bg-surface w-full">
      <motion.div
       initial={{ opacity: 0, scale: 0.95 }}
       whileInView={{ opacity: 1, scale: 1 }}
       viewport={{ once: true }}
       whileHover={{ y: -6 }}
      >
       <h3 className="text-3xl mb-4">Pay-As-You-Route</h3>

       <div className="text-[3.5rem] font-black mb-8">
        0.5% <span className="text-base text-text-muted">/ transfer</span>
       </div>

       <ul className="list-none p-0 text-left mb-8 flex flex-col gap-4">
        <li className="flex items-center gap-2 font-semibold">
         <CheckCircle size={20} color="var(--color-primary-dark)" /> Free Route
         Evaluation
        </li>
        <li className="flex items-center gap-2 font-semibold">
         <CheckCircle size={20} color="var(--color-primary-dark)" /> No Setup
         Costs
        </li>
        <li className="flex items-center gap-2 font-semibold">
         <CheckCircle size={20} color="var(--color-primary-dark)" /> Priority
         Support
        </li>
       </ul>

       <Link href="/authenticate" className="block">
        <Button variant="primary" className="w-full">
         Start Using SendLess
        </Button>
       </Link>
      </motion.div>
     </TiltWrap>
    </div>
   </motion.section>

   <motion.footer
    id="support"
    className="py-16 px-8 bg-[#111] text-white"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
   >
    <div className="footer-container max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-8">
     <div>
      <div className="text-2xl font-black flex items-center gap-2">
       <motion.div whileHover={{ rotate: 20 }}>
        <Zap size={24} color="#a8ff53" fill="#a8ff53" />
       </motion.div>
       SENDLESS
      </div>
      <p className="text-[#888] mt-2">
       &copy; {new Date().getFullYear()} The future of multi-rail payment
       routing.
      </p>
     </div>

     <div className="flex gap-8 flex-wrap">
      <motion.a
       href="#"
       whileHover={{ y: -2 }}
       className="text-white font-semibold"
      >
       Help Center
      </motion.a>
      <motion.a
       href="#"
       whileHover={{ y: -2 }}
       className="text-white font-semibold"
      >
       Contact Sales
      </motion.a>
     </div>
    </div>
   </motion.footer>
  </div>
 );
}
