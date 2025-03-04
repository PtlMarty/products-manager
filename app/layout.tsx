import Footer from "@/components/global/Footer";
import NavBar from "@/components/global/NavBar";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-50 flex flex-col justify-between`}
      >
        <SessionProvider session={session}>
          <NavBar />
          <div className="flex-1 pt-16 h-fit">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
