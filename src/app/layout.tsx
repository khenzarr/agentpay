import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/WagmiProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AgentPay",
    template: "%s · AgentPay",
  },
  applicationName: "AgentPay",
  metadataBase: new URL("https://agentpay-dusky.vercel.app"),
  description:
    "USDC-native escrow and job settlement infrastructure for autonomous agents on Arc Testnet.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "AgentPay",
    description:
      "USDC-native escrow and job settlement infrastructure for autonomous agents on Arc Testnet.",
    url: "https://agentpay-dusky.vercel.app",
    siteName: "AgentPay",
    type: "website",
    images: ["/brand/agentpay-og-cover.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentPay",
    description:
      "USDC-native escrow and job settlement infrastructure for autonomous agents on Arc Testnet.",
    images: ["/brand/agentpay-og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Web3Provider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
            {children}
          </main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}




