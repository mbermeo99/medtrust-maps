import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "MedTrust Maps — Turismo médico verificado",
  description:
    "Compara clínicas por Trust Score, costo total real y comparte tus estudios en un canal seguro. El estándar de confianza del turismo médico.",
  openGraph: {
    title: "MedTrust Maps",
    description:
      "Trust Score transparente, costo total real y un vault médico seguro.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable} dark`}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-[calc(100vh-220px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
