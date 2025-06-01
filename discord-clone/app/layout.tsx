import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { cn } from "@/lib/utils";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const font = Open_Sans({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: "chachachat",
  description: "time to chattificate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="theme">
              <SocketProvider>
                <ModalProvider />
                <QueryProvider >
                  {children} 
                </QueryProvider>
              </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
