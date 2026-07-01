import { useMutation } from "@tanstack/react-query";
import { notesService } from "@/services/notes.service";
import type { CreateNoteInput } from "@/schemas/note";
import type { CreateNoteResponse } from "@/types";

export function useCreateNote() {
  return useMutation<CreateNoteResponse, Error, CreateNoteInput>({
    mutationFn: (data) => notesService.createNote(data),
  });
}
