import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureNotes - Secure Note Sharing",
  description: "Share secrets securely using one-time read links and password protected decryption.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <Providers>
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
