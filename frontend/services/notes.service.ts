import { api } from "@/services/api";
import type { CreateNoteInput } from "@/schemas/note";
import type { NoteResponse, CreateNoteResponse } from "@/types";

export const notesService = {
  async createNote(data: CreateNoteInput): Promise<CreateNoteResponse> {
    const response = await api.post<CreateNoteResponse>("/notes", data);
    return response.data;
  },

  async getNote(id: string): Promise<NoteResponse> {
    const response = await api.get<NoteResponse>(`/notes/${id}`);
    return response.data;
  },

  async getNotes(): Promise<NoteResponse[]> {
    const response = await api.get<NoteResponse[]>("/notes");
    return response.data;
  },
};
