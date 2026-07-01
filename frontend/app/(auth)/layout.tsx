import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <header className="w-full border-b border-border/40 py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-95 transition-opacity">
            <Shield className="h-5 w-5 text-primary" />
            <span>SecureNotes</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="w-full border-t border-border/40 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SecureNotes. All rights reserved.
      </footer>
    </div>
  );
}
