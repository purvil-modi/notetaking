"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Check, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface ShareLinkDisplayProps {
  shareLink: string;
  password?: string;
}

export function ShareLinkDisplay({ shareLink, password }: ShareLinkDisplayProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string, isLink: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isLink) {
        setCopiedLink(true);
        toast.success("Share link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedPassword(true);
        toast.success("Decryption password copied to clipboard!");
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch (err) {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <Card className="border border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Share Link</CardTitle>
        <CardDescription>
          Distribute this link to share the note. The access rules configured will apply when accessed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <Input readOnly value={shareLink} className="bg-slate-950/40 border-input text-white" />
          <Button size="icon" variant="outline" onClick={() => copyToClipboard(shareLink, true)}>
            {copiedLink ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {password && (
          <Alert className="border-amber-900/50 bg-amber-950/20 text-amber-500 space-y-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-5 w-5 mt-0.5 text-amber-500 shrink-0" />
              <div>
                <AlertTitle className="font-bold text-amber-400">Decryption Key Generated!</AlertTitle>
                <AlertDescription className="text-slate-300 text-xs mt-1">
                  Make sure to copy the password below now. It is encrypted in the database and{" "}
                  <strong>will never be shown again</strong>.
                </AlertDescription>
              </div>
            </div>

            <div className="flex gap-2 items-center pt-1">
              <div className="relative flex-1">
                <Input
                  readOnly
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="bg-slate-950 border-input text-amber-400 font-mono"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(password, false)}>
                {copiedPassword ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
