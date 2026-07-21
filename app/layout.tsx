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

const SITE_URL = "https://thaysflorbc.vercel.app";
const OG_IMAGE_URL =
  "https://conexaojunina.com.br/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-21-at-11.25.14.jpeg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Thays Flor | Clínica de Estética Avançada",
  description:
    "Tratamentos estéticos avançados guiados por técnica apurada e cuidado humanizado — harmonização facial, botox, preenchimento e mais.",
  openGraph: {
    title: "Thays Flor | Clínica de Estética Avançada",
    description:
      "Tratamentos estéticos avançados guiados por técnica apurada e cuidado humanizado.",
    url: SITE_URL,
    siteName: "Thays Flor",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        alt: "Thays Flor — Clínica de Estética",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thays Flor | Clínica de Estética Avançada",
    description:
      "Tratamentos estéticos avançados guiados por técnica apurada e cuidado humanizado.",
    images: [OG_IMAGE_URL],
  },
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