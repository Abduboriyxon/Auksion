import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIP Auksion | Eksklyuziv Avtoraqamlar",
  description: "O'zbekistondagi eng nufuzli avtomobil raqamlari auksioni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
