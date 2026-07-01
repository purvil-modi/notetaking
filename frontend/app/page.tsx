import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, EyeOff, Hourglass, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/notes/new");
  }

  return (
    <div className="flex-1 flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      {/* Landing Navbar */}
      <header className="w-full border-b border-border/40 bg-transparent py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Shield className="h-5 w-5 text-primary" />
            <span>SecureNotes</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-1.5 text-xs text-slate-300">
            <Lock className="h-3 w-3 text-primary animate-pulse" />
            <span>Military-grade local encryption pipeline</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Share Secret Notes <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-200 to-slate-200 bg-clip-text text-transparent">
              That Self-Destruct
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto pt-2">
            Send confidential information with absolute confidence. Protect links with automatically
            generated passwords, custom expiration, and single-use read rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link href="/register">
              Start Sharing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-slate-800 hover:bg-slate-900 text-white">
            <Link href="/login">Sign In to Dashboard</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left w-full">
          <div className="border border-border/60 bg-card/40 rounded-xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <EyeOff className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-white text-lg">One-Time Links</h3>
            <p className="text-slate-400 text-sm">
              Links self-destruct immediately after they are read. Prevents subsequent visits from exposing secrets.
            </p>
          </div>

          <div className="border border-border/60 bg-card/40 rounded-xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-white text-lg">Decryption Keys</h3>
            <p className="text-slate-400 text-sm">
              Protect details with server-generated random tokens. Key stays off database logs to maximize secrecy.
            </p>
          </div>

          <div className="border border-border/60 bg-card/40 rounded-xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hourglass className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-white text-lg">Expiration Clocks</h3>
            <p className="text-slate-400 text-sm">
              Specify custom validity durations. Expired links throw secure HTTP 410 statuses automatically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
