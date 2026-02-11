"use client";

import { ToastProvider } from "@/components/ui/toast";
import { UiPreferenceAttributes } from "@/components/ui/ui-preference-attributes";

/**
 * Wraps descendants with UI-related providers for toasts and UI preferences.
 *
 * @param children - Content to render inside the providers
 * @returns A JSX element that renders `children` within toast and UI preference providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UiPreferenceAttributes />
      {children}
    </ToastProvider>
  );
}