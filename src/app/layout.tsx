import type { Metadata } from "next";
import { Inter, Bangers } from "next/font/google"; // Comic font
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mangasia | AI Manga Studio",
  description: "Create manga and animated stories with the power of Gemini 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bangers.variable} antialiased h-screen w-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
