"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Plus, User } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setMounted(true);

    const handleStorage = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success("Successfully logged out");
    router.push("/login");
    router.refresh();
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Shield className="h-5 w-5 text-primary" />
            <span>SecureNotes</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-95 transition-opacity">
          <Shield className="h-5 w-5 text-primary" />
          <span>SecureNotes</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-300 mr-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <User className="h-3.5 w-3.5" />
                <span>{user.name}</span>
              </div>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-slate-800 hover:bg-slate-900 text-white">
                <Link href="/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
