"use client";

import { ToastProvider } from "@/components/ui/toast";
import { UiPreferenceAttributes } from "@/components/ui/ui-preference-attributes";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ToastProvider>
        <UiPreferenceAttributes />
        {children}
      </ToastProvider>
    </Suspense>
  );
}
