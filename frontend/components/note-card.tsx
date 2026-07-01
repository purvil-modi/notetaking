import { formatDate } from "@/lib/utils";
import type { NoteResponse } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ShieldAlert } from "lucide-react";

interface NoteCardProps {
  note: NoteResponse;
}

export function NoteCard({ note }: NoteCardProps) {
  const getStatusBadge = () => {
    if (note.isRevoked) {
      return <Badge variant="destructive">Revoked</Badge>;
    }
    if (note.isUsed && note.shareType === "ONE_TIME") {
      return <Badge variant="secondary">Used / Destroyed</Badge>;
    }
    if (note.expiryAt && new Date(note.expiryAt) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">Active</Badge>;
  };

  return (
    <Card className="border border-border/80 bg-card overflow-hidden">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-white">{note.title}</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Created on {formatDate(note.createdAt)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">{getStatusBadge()}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap break-all min-h-[120px]">
          {note.content}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="h-4 w-4 text-primary" />
            <span>Views: <strong className="text-white">{note.viewCount}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              Expiry:{" "}
              <strong className="text-white">
                {note.shareType === "ONE_TIME" ? "One Time Access" : "Time Based"}
              </strong>
            </span>
          </div>

          {note.expiryAt && (
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span>
                Expires: <strong className="text-white">{formatDate(note.expiryAt)}</strong>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
