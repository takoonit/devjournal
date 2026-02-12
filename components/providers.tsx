"use client";

import { ToastProvider } from "@/components/ui/toast";
import { UiPreferenceAttributes } from "@/components/ui/ui-preference-attributes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UiPreferenceAttributes />
      {children}
    </ToastProvider>
  );
}
