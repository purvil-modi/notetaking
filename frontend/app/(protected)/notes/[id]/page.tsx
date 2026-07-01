"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useNote, useRevokeNote } from "@/hooks/use-note";
import { NoteCard } from "@/components/note-card";
import { ShareLinkDisplay } from "@/components/share-link-display";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShieldCheck, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface NoteDetailsContentProps {
  noteId: string;
}

function NoteDetailsContent({ noteId }: NoteDetailsContentProps) {
  const searchParams = useSearchParams();

  const isCreated = searchParams.get("created") === "true";
  const password = searchParams.get("password") || undefined;

  const { data: note, isLoading, error } = useNote(noteId);
  const { mutate: revokeNote, isPending: isRevoking } = useRevokeNote();

  const handleRevoke = () => {
    revokeNote(noteId, {
      onSuccess: () => {
        toast.success("Share link revoked successfully!");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to revoke note");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto w-full">
        <Skeleton className="h-10 w-48 animate-pulse bg-muted" />
        <Skeleton className="h-[300px] w-full animate-pulse bg-muted" />
        <Skeleton className="h-[150px] w-full animate-pulse bg-muted" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 pt-12">
        <h2 className="text-2xl font-bold text-red-500">Error Loading Note</h2>
        <p className="text-slate-400">
          {error?.message || "The note you are looking for does not exist or you do not have permission to view it."}
        </p>
        <Button asChild>
          <Link href="/notes/new">Go Back</Link>
        </Button>
      </div>
    );
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const shareLink = `${appUrl}/share/${note.shareToken}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
          <Link href="/notes/new">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Create another note
          </Link>
        </Button>

        {!note.isRevoked && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isRevoking}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isRevoking ? "Revoking..." : "Revoke Share Link"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action will permanently revoke the sharing link. Anyone attempting to access the link will receive a 410 Gone status code. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-muted text-white hover:bg-muted/80">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevoke} className="bg-destructive hover:bg-destructive/80 text-white">
                  Revoke Link
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {isCreated && (
        <Alert className="border-green-900/50 bg-green-950/20 text-green-400 flex items-start gap-2">
          <ShieldCheck className="h-5 w-5 text-green-400 mt-0.5" />
          <div>
            <AlertTitle className="font-bold">Note Created Successfully!</AlertTitle>
            <AlertDescription className="text-slate-300 text-sm mt-1">
              Your note has been securely saved. You can copy the link below to share it. Note settings are configured as:
              <strong className="block mt-1">
                Expiry: {note.shareType === "ONE_TIME" ? "One Time Access" : "Time Based Access"} | Access: {note.accessType === "PASSWORD_PROTECTED" ? "Password Protected" : "Public"}
              </strong>
            </AlertDescription>
          </div>
        </Alert>
      )}

      <NoteCard note={note} />

      <ShareLinkDisplay shareLink={shareLink} password={password} />
    </div>
  );
}

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const resolvedParams = React.use(params);
  const noteId = resolvedParams.id;

  return (
    <React.Suspense
      fallback={
        <div className="space-y-6 max-w-4xl mx-auto w-full">
          <Skeleton className="h-10 w-48 animate-pulse bg-muted" />
          <Skeleton className="h-[300px] w-full animate-pulse bg-muted" />
          <Skeleton className="h-[150px] w-full animate-pulse bg-muted" />
        </div>
      }
    >
      <NoteDetailsContent noteId={noteId} />
    </React.Suspense>
  );
}
