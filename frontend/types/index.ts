export type ShareType = "ONE_TIME" | "TIME_BASED";
export type AccessType = "PUBLIC" | "PASSWORD_PROTECTED";

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  shareToken: string;
  shareType: ShareType;
  accessType: AccessType;
  expiryAt: string | null;
  isRevoked: boolean;
  isUsed: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateNoteResponse {
  note: {
    id: string;
    title: string;
    shareToken: string;
    shareType: ShareType;
    accessType: AccessType;
    expiryAt: string | null;
    viewCount: number;
    isRevoked: boolean;
    isUsed: boolean;
    createdAt: string;
  };
  password?: string;
}

export interface SharedNoteResponse {
  title: string;
  content: string;
  shareType: ShareType;
  accessType: AccessType;
  viewCount: number;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
}
