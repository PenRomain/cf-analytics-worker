import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GlobalStylesProvider from "./shared/global-styles-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CF Analytics Worker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalStylesProvider>{children}</GlobalStylesProvider>
      </body>
    </html>
  );
}
