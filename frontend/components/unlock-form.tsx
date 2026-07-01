"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unlockNoteSchema, type UnlockNoteInput } from "@/schemas/note";
import { useUnlockNote } from "@/hooks/use-share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { SharedNoteResponse } from "@/types";

interface UnlockFormProps {
  token: string;
  shareType: string;
  onSuccess: (note: SharedNoteResponse) => void;
}

export function UnlockForm({ token, shareType, onSuccess }: UnlockFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutate: unlockNote, isPending } = useUnlockNote(token);

  const form = useForm<UnlockNoteInput>({
    resolver: zodResolver(unlockNoteSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: UnlockNoteInput) => {
    setErrorMsg(null);
    unlockNote(data.password, {
      onSuccess: (result) => {
        toast.success("Note decrypted successfully!");
        onSuccess(result);
      },
      onError: (err: any) => {
        const msg = err.message || "Failed to decrypt note";
        setErrorMsg(msg);
        toast.error(msg);
      },
    });
  };

  return (
    <Card className="max-w-md mx-auto border border-border/80 bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <KeyRound className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Decrypt Note</CardTitle>
        <CardDescription>
          This note is password-protected. Enter the decryption password to view it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {shareType === "ONE_TIME" && (
          <Alert className="border-amber-900/50 bg-amber-950/20 text-amber-500">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs">
              <strong>Warning:</strong> This is a one-time link. Decrypting and viewing the note
              will permanently destroy the link.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decryption Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter decryption password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Decrypting..." : "Unlock Note"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
