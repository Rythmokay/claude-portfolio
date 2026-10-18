import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Studio CMS — Rythm Jagga",
  description: "Management dashboard for portfolio content and database",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink selection:bg-accent/20">
        {children}
      </body>
    </html>
  );
}
