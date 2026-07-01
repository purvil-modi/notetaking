import { useQuery, useMutation } from "@tanstack/react-query";
import { shareService, type GetShareResponse } from "@/services/share.service";
import type { SharedNoteResponse } from "@/types";

export function useSharedNote(token: string) {
  return useQuery<GetShareResponse, Error>({
    queryKey: ["share", token],
    queryFn: () => shareService.getSharedNote(token),
    enabled: !!token,
    retry: false,
  });
}

export function useUnlockNote(token: string) {
  return useMutation<SharedNoteResponse, Error, string>({
    mutationFn: (password) => shareService.unlockNote(token, password),
  });
}
