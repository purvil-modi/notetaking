"use client";

import { useRouter } from "next/navigation";
import { NoteForm } from "@/components/note-form";
import type { CreateNoteResponse } from "@/types";

export default function NewNotePage() {
  const router = useRouter();

  const handleSuccess = (data: CreateNoteResponse) => {
    let url = `/notes/${data.note.id}?created=true`;
    if (data.password) {
      url += `&password=${encodeURIComponent(data.password)}`;
    }
    router.push(url);
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-4 sm:py-8 flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Share a Note</h1>
        <p className="text-slate-400 text-sm">
          Write down your secrets, choose access controls, and generate an encrypted sharing link.
        </p>
      </div>
      <NoteForm onSuccess={handleSuccess} />
    </div>
  );
}
