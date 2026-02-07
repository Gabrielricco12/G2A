import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// 1. Configuração da Viewport (Cores e Escala)
export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Metadados do PWA
export const metadata: Metadata = {
  title: "G2A - Gestão de Audiologia",
  description: "Sistema completo para fonoaudiólogos",
  manifest: "/manifest.json", // Aponta para o arquivo que criamos
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "G2A",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}