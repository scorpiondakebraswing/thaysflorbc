import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Thays Flor | Clínica de Estética Avançada",
  description:
    "Tratamentos estéticos avançados guiados por técnica apurada e cuidado humanizado — harmonização facial, botox, preenchimento e mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
