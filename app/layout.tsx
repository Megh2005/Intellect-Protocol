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
