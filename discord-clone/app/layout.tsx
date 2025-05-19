import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${font.className} ${font.className} antialiased`} >
        {children}
      </body>
    </html>
  );
}
