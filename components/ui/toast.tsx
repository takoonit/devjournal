"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, Sparkles, X } from "lucide-react";
import { useDevJournalStore } from "@/lib/store";
import {
  resolveSupportiveToastCopy,
  type ToastType,
  type ToastCopyKey,
} from "@/lib/supportive-copy";

type ToastTone = ToastType;

interface ToastInput {
  message: string;
  type?: ToastType;
  copyKey?: ToastCopyKey;
}

interface Toast {
  id: string;
  message: string;
  title: string;
  emphasis?: string;
  type: ToastTone;
}

interface ToastContextType {
  addToast: (input: string | ToastInput, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const icons: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-300" />,
  error: <XCircle className="h-4 w-4 text-rose-300" />,
  info: <Info className="h-4 w-4 text-cyan-300" />,
};

const toneClasses: Record<ToastTone, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10",
  error: "border-rose-500/40 bg-rose-500/10",
  info: "border-cyan-500/40 bg-cyan-500/10",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const { rewardIntensity, motionLevel } = useDevJournalStore((state) => state.uiPreferences);

  const addToast = useCallback(
    (input: string | ToastInput, legacyType: ToastType = "info") => {
      const normalized =
        typeof input === "string"
          ? { message: input, type: legacyType }
          : { message: input.message, type: input.type ?? "info", copyKey: input.copyKey };

      const resolved = resolveSupportiveToastCopy({
        type: normalized.type,
        rewardIntensity,
        fallbackMessage: normalized.message,
        copyKey: normalized.copyKey,
      });

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [
        ...prev,
        {
          id,
          message: resolved.message,
          title: resolved.title,
          emphasis: resolved.emphasis,
          type: normalized.type,
        },
      ].slice(-5));

      const timeoutMs = rewardIntensity === "full" ? 4800 : rewardIntensity === "off" ? 2600 : 3600;
      const timeoutId = setTimeout(() => {
        timeoutRef.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, timeoutMs);
      timeoutRef.current.set(id, timeoutId);
    },
    [rewardIntensity]
  );

  const removeToast = useCallback((id: string) => {
    const timeoutId = timeoutRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRef.current.delete(id);
    }

    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const motionDuration = motionLevel === "reduced" ? 0.12 : motionLevel === "expressive" ? 0.32 : 0.2;

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3 px-3" aria-live="polite" aria-label="Notifications">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 18, scale: motionLevel === "expressive" ? 0.92 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: motionDuration }}
              className="rounded-xl border border-zinc-800 bg-zinc-950/95 p-3 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.85)] backdrop-blur"
              role={toast.type === "error" ? "alert" : "status"}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-md border px-1.5 py-1 ${toneClasses[toast.type]}`}>{icons[toast.type]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-100">{toast.title}</p>
                    {rewardIntensity === "full" && toast.type === "success" ? (
                      <Sparkles className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-300">{toast.message}</p>
                  {toast.emphasis ? <p className="mt-1 text-xs text-zinc-400">{toast.emphasis}</p> : null}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
