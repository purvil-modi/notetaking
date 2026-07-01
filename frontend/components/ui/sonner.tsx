"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        className: "border-border bg-card text-foreground",
      }}
    />
  );
}
