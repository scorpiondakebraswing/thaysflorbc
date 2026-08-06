# Configuração necessária no projeto `thaysflorbc`

## 1. Instalar dependências

```bash
npm install framer-motion lucide-react
```

## 2. Liberar o domínio das imagens (next.config.ts)

O Next.js bloqueia imagens externas por padrão. Adicione o domínio da logo/foto
no seu `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "conexaojunina.com.br",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
```

## 3. Adicionar as fontes (Playfair Display + Manrope)

No seu `app/layout.tsx`, importe as fontes via `next/font/google` e aplique a
classe no `<html>` ou `<body>`:

```tsx
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

> Se preferir não mexer no layout agora, os componentes já funcionam com as
> fontes de fallback (`serif`/`system-ui`) definidas em `globals.theme.css` —
> a estética funciona, só não fica com a tipografia definitiva.

## 4. Tokens de cor (Tailwind v4)

Seu projeto não tem `tailwind.config.js` (confirma Tailwind CSS v4). Copie o
conteúdo de `app/globals.theme.css` para o topo do seu `app/globals.css`
existente — ele define as cores (`wine`, `cream`, `nude`, `stone`, `ink`) e as
famílias de fonte (`font-display`, `font-sans`) usadas em todos os
componentes.

## 5. Estrutura de arquivos entregue

```
app/
  page.tsx              → Homepage (importa as seções)
  globals.theme.css      → Tokens para colar em globals.css
components/
  Header.tsx              → Navegação + menu mobile
  Hero.tsx                → Seção principal
  About.tsx               → Sobre a especialista
  Procedures.tsx          → Cards de procedimentos
  Footer.tsx              → Rodapé
  PetalMotif.tsx           → SVG decorativo (assinatura visual)
```

## 6. Rotas referenciadas (ainda não criadas)

Os componentes linkam para `/login`, `/agendamento` e `/procedimentos/[slug]`.
Essas páginas ainda não existem — posso criá-las em uma próxima etapa, sem
mexer no que já está pronto aqui.
