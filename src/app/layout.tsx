import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3IDN - Learn Blockchain, Mint NFT Badges, Trade & Stake",
  description: "Learn blockchain, crypto, DeFi, Web3 and earn NFT badges. Trade NFTs and stake them to earn daily points on Base network.",
  keywords: ["Web3IDN", "Blockchain", "NFT", "Learning", "Base Network", "DeFi", "Web3", "Crypto", "Staking"],
  authors: [{ name: "Web3IDN Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Web3IDN - Learn & Earn NFT Badges",
    description: "Master blockchain technology and earn exclusive NFT badges on Base network",
    url: "https://web3idn.app",
    siteName: "Web3IDN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3IDN - Learn & Earn NFT Badges",
    description: "Master blockchain technology and earn exclusive NFT badges",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
