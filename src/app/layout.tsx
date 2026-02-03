import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navigation } from "@/components/layout";
import { AppProviders } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tribuna - Plataforma de Debates Intelectuais",
  description: "Ambiente de presença intelectual onde usuários debatem para evoluir cognitivamente. Debater, aprender, evoluir.",
  keywords: ["debates", "intelectual", "aprendizado", "discussão", "argumentação"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <Navigation />
          <main id="main-content" className="main-layout">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
