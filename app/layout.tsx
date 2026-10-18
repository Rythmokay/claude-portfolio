import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PortfolioProvider } from "@/lib/portfolio-provider";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Rythm Jagga — Portfolio",
  description:
    "Portfolio of Rythm Jagga: Full Stack Software Engineer building production web apps, Android apps, and microservices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={serif.variable}>
      <body className="font-serif">
        <PortfolioProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PortfolioProvider>
      </body>
    </html>
  );
}
