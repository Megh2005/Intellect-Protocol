import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { AppLayout } from "@/components/app-layout";
import AuthGuard from "@/components/auth-guard";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intellect Protocol",
  description: "Generate and register AI images on Intellect Protocol",
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
