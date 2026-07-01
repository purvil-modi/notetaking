import { api } from "@/services/api";
import type { SharedNoteResponse } from "@/types";

export type GetShareResponse =
  | { requiresPassword: true; shareType: string; accessType: string }
  | SharedNoteResponse;

export const shareService = {
  async getSharedNote(token: string): Promise<GetShareResponse> {
    const response = await api.get<GetShareResponse>(`/share/${token}`);
    return response.data;
  },

  async unlockNote(token: string, password: string): Promise<SharedNoteResponse> {
    const response = await api.post<SharedNoteResponse>(`/share/${token}/unlock`, {
      password,
    });
    return response.data;
  },

  async revokeNote(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/share/revoke/${id}`);
    return response.data;
  },
};
