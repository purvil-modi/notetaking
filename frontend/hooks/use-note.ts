import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService } from "@/services/notes.service";
import { shareService } from "@/services/share.service";
import type { NoteResponse } from "@/types";

export function useNote(noteId: string) {
  return useQuery<NoteResponse, Error>({
    queryKey: ["note", noteId],
    queryFn: () => notesService.getNote(noteId),
    enabled: !!noteId,
  });
}

export function useRevokeNote() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (noteId) => shareService.revokeNote(noteId),
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
