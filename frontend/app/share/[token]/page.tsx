"use client";

import * as React from "react";
import { useSharedNote } from "@/hooks/use-share";
import { UnlockForm } from "@/components/unlock-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Eye, Calendar, AlertOctagon, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { SharedNoteResponse } from "@/types";
import Link from "next/link";

interface SharePageContentProps {
  token: string;
}

function SharePageContent({ token }: SharePageContentProps) {
  const { data: result, isLoading, error, refetch } = useSharedNote(token);
  const [unlockedNote, setUnlockedNote] = React.useState<SharedNoteResponse | null>(null);

  const handleUnlockSuccess = (note: SharedNoteResponse) => {
    setUnlockedNote(note);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto w-full pt-10">
        <Skeleton className="h-[250px] w-full animate-pulse bg-muted" />
      </div>
    );
  }

  if (error) {
    const status = (error as any).status;
    let title = "Unable to access note";
    let desc = error.message || "An error occurred while loading this note link.";
    let showReset = false;

    if (status === 404) {
      title = "Note Not Found";
      desc = "The link is invalid or the note does not exist.";
    } else if (status === 410) {
      title = "Note Destroyed or Expired";
      desc = error.message; // e.g. "This link has already been used." or "This link has expired."
    } else if (status === 429) {
      title = "Rate Limit Exceeded";
      desc = "Too many failed attempts. Please wait 15 minutes and try again.";
      showReset = true;
    }

    return (
      <Card className="max-w-md mx-auto border border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-red-950/20 flex items-center justify-center mb-2">
            <AlertOctagon className="h-5 w-5 text-red-500" />
          </div>
          <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
          <CardDescription className="text-slate-400 mt-1">{desc}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-2">
          {showReset ? (
            <Button onClick={() => refetch()} variant="outline" className="text-white border-slate-800">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          ) : (
            <Button asChild>
              <Link href="/">Create Your Own Note</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // If unlocked via password form
  const displayedNote = unlockedNote || (result && !("requiresPassword" in result) ? result : null);

  if (displayedNote) {
    return (
      <Card className="max-w-2xl mx-auto border border-border/80 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-white">{displayedNote.title}</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Shared Note | Created on {formatDate(displayedNote.createdAt)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap break-all min-h-[120px]">
            {displayedNote.content}
          </div>

          {displayedNote.shareType === "ONE_TIME" && (
            <Alert className="border-red-900/50 bg-red-950/10 text-red-400">
              <AlertOctagon className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-xs">
                This was a one-time link. The note has been permanently deleted from the database
                and cannot be loaded again.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center gap-4 text-slate-400 text-xs pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>Views: <strong className="text-white">{displayedNote.viewCount}</strong></span>
            </div>
            <Button asChild variant="link" className="h-auto p-0 text-primary">
              <Link href="/">Create a Secure Note</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If it requires password
  if (result && "requiresPassword" in result) {
    return (
      <UnlockForm
        token={token}
        shareType={result.shareType}
        onSuccess={handleUnlockSuccess}
      />
    );
  }

  return null;
}

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const resolvedParams = React.use(params);
  const token = resolvedParams.token;

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      {/* Minimal Header */}
      <header className="w-full border-b border-border/40 py-4 mb-8 bg-transparent">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <Shield className="h-5 w-5 text-primary" />
            <span>SecureNotes</span>
          </Link>
          <Button asChild size="sm" variant="outline" className="border-slate-800 text-white hover:bg-slate-900">
            <Link href="/">Create Note</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8 flex flex-col justify-center">
        <React.Suspense
          fallback={
            <div className="space-y-6 max-w-2xl mx-auto w-full">
              <Skeleton className="h-[250px] w-full animate-pulse bg-muted" />
            </div>
          }
        >
          <SharePageContent token={token} />
        </React.Suspense>
      </main>

      <footer className="w-full border-t border-border/40 py-4 mt-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SecureNotes. All rights reserved.
      </footer>
    </div>
  );
}
