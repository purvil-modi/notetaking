"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoteSchema, type CreateNoteInput } from "@/schemas/note";
import { useCreateNote } from "@/hooks/use-create-note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import type { CreateNoteResponse } from "@/types";

interface NoteFormProps {
  onSuccess: (data: CreateNoteResponse) => void;
}

export function NoteForm({ onSuccess }: NoteFormProps) {
  const { mutate: createNote, isPending } = useCreateNote();

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      shareType: "ONE_TIME",
      accessType: "PUBLIC",
      expiryAt: "",
    },
  });

  const shareType = form.watch("shareType");

  const onSubmit = (data: CreateNoteInput) => {
    createNote(data, {
      onSuccess: (result) => {
        toast.success("Secure note created!");
        onSuccess(result);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create note");
      },
    });
  };

  return (
    <Card className="border border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create a New Note</CardTitle>
        <CardDescription>
          Your content is encrypted securely. Configure access rules below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your secret note here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shareType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-input text-white">
                          <SelectValue placeholder="Select expiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border bg-card text-white">
                        <SelectItem value="ONE_TIME">One Time Access</SelectItem>
                        <SelectItem value="TIME_BASED">Time Based Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-400">
                      Determine when the note should be deleted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-input text-white">
                          <SelectValue placeholder="Select access type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border bg-card text-white">
                        <SelectItem value="PUBLIC">Public (Anyone with link)</SelectItem>
                        <SelectItem value="PASSWORD_PROTECTED">
                          Password Protected (Requires Decryption)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-400">
                      Auto-generate a secure key for unlocking.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {shareType === "TIME_BASED" && (
              <FormField
                control={form.control}
                name="expiryAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="bg-transparent border-input text-white w-full"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      Specify exactly when the share link expires.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Encrypting & Saving..." : "Generate Secure Share Link"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
