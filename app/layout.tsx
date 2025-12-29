// src/app/layout.tsx

import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import { ClientOnlyTopLoader } from "@components/ClientOnlyTopLoader";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "@features/auth/context/AuthProvider";
import ToastProvider from "../components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "Sistem Manajemen Sumber Daya Manusia",
  description: "HR Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${robotoMono.variable}`}>
        {/* Providers must be inside Body */}
        <AuthProvider>
          <PrimeReactProvider>
            <ClientOnlyTopLoader />

            {/* 1. Global UI Components */}
            <ToastProvider>
              {/* 2. The Page Content */}
              {children}
            </ToastProvider>
          </PrimeReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
