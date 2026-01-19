import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskRight — Prompt Learning Playground",
  description:
    "AskRight helps you learn how to ask better questions with guided prompts, feedback, and structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
        <div className="min-h-screen bg-background text-ink flex flex-col">
          <NavBar />
          <main className="container py-[10px] flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
