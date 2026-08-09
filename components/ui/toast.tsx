"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
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
    return { addToast: () => {} };
  }
  return context;
}

const toneTick: Record<ToastTone, string> = {
  success: "bg-positive",
  error: "bg-destructive",
  info: "bg-accent",
};

const toneLabel: Record<ToastTone, string> = {
  success: "text-positive",
  error: "text-destructive",
  info: "text-accent",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const { motionLevel, rewardIntensity } = useDevJournalStore((state) => state.uiPreferences);
  const rewardIntensityRef = useRef(rewardIntensity);
  const osReduced = useReducedMotion();
  const still = motionLevel === "reduced" || Boolean(osReduced);

  useEffect(() => {
    rewardIntensityRef.current = rewardIntensity;
  }, [rewardIntensity]);

  const addToast = useCallback(
    (input: string | ToastInput, legacyType: ToastType = "info") => {
      const normalized =
        typeof input === "string"
          ? { message: input, type: legacyType }
          : { message: input.message, type: input.type ?? "info", copyKey: input.copyKey };

      const resolved = resolveSupportiveToastCopy({
        type: normalized.type,
        rewardIntensity: rewardIntensityRef.current,
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

      const timeoutMs = 3600;
      const timeoutId = setTimeout(() => {
        timeoutRef.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, timeoutMs);
      timeoutRef.current.set(id, timeoutId);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    const timeoutId = timeoutRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRef.current.delete(id);
    }

    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pauseDismiss = useCallback((id: string) => {
    const timeoutId = timeoutRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRef.current.delete(id);
    }
  }, []);

  const resumeDismiss = useCallback((id: string) => {
    if (timeoutRef.current.has(id)) return;
    const timeoutId = setTimeout(() => {
      timeoutRef.current.delete(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
    timeoutRef.current.set(id, timeoutId);
  }, []);

  useEffect(() => {
    const timeouts = timeoutRef.current;

    return () => {
      timeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeouts.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3 px-3 print-hidden" aria-live="polite" aria-label="Notifications">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: still ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: still ? 0.08 : 0.2, ease: [0.2, 0, 0, 1] }}
              className="sheet relative overflow-hidden p-4 pl-5"
              role={toast.type === "error" ? "alert" : "status"}
              onMouseEnter={() => pauseDismiss(toast.id)}
              onMouseLeave={() => resumeDismiss(toast.id)}
            >
              <span className={`absolute inset-y-0 left-0 w-0.5 ${toneTick[toast.type]}`} aria-hidden="true" />
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className={`font-mono text-label uppercase ${toneLabel[toast.type]}`}>{toast.title}</p>
                  <p className="mt-1 text-ui text-text-primary">{toast.message}</p>
                  {toast.emphasis ? (
                    <p className="mt-0.5 text-ui italic text-text-secondary">{toast.emphasis}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-text-muted transition-colors duration-subtle hover:text-text-primary"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
