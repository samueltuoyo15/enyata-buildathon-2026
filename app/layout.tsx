import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getUser } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";

import Navbar from "@/app/components/Navbar";

const geistSans = localFont({
 src: "./fonts/GeistVF.woff",
 variable: "--font-geist-sans",
 weight: "100 900"
});

const geistMono = localFont({
 src: "./fonts/GeistMonoVF.woff",
 variable: "--font-geist-mono",
 weight: "100 900"
});

export const metadata: Metadata = {
 title: "SendLess",
 description: "Cross-border payment routing engine"
};

export default async function RootLayout({
 children
}: {
 children: React.ReactNode;
}) {
 const profile: Profile | null = await getUser();

 return (
  <html lang="en">
   <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <Navbar profile={profile} />
    {children}
   </body>
  </html>
 );
}
