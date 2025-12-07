import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { AppLayout } from "@/components/app-layout";
import AuthGuard from "@/components/auth-guard";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://intellect-protocol.vercel.app'),
  title: {
    default: "Intellect Protocol | AI Intellectual Property Layer",
    template: "%s | Intellect Protocol"
  },
  description: "The decentralized layer for AI Intellectual Property. Generate, register, and monetize your AI assets with immutable proof of ownership on the Story Protocol.",
  keywords: ["Intellectual Property", "AI", "Blockchain", "Story Protocol", "IP Enforcement", "Generative AI", "Crypto", "NFT", "Web3"],
  authors: [{ name: "Intellect Protocol Team" }],
  creator: "Intellect Protocol",
  publisher: "Intellect Protocol",
  icons: {
    icon: "https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png",
    shortcut: "https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png",
    apple: "https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intellect-protocol.vercel.app",
    title: "Intellect Protocol | AI Intellectual Property Layer",
    description: "Generate, register, and monetize your AI assets with immutable proof of ownership on the Story Protocol.",
    siteName: "Intellect Protocol",
    images: [
      {
        url: "https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png",
        width: 1200,
        height: 630,
        alt: "Intellect Protocol - AI IP Layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intellect Protocol | AI Intellectual Property Layer",
    description: "The decentralized layer for AI Intellectual Property. Secure your Generative AI assets.",
    images: ["https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png"],
    creator: "@IntellectProtocol",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="shortcut icon"
          href="https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png"
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href="https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png"
        />
      </head>
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <AuthGuard>
              <AppLayout>{children}</AppLayout>
              <Toaster
                theme="dark"
                richColors
                closeButton
                position="top-right"
                duration={3000}
              />
            </AuthGuard>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
