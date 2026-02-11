import type { UiPreferences } from "@/lib/store";

export type ToastType = "success" | "error" | "info";
export type ToastCopyKey =
  | "import-success"
  | "import-error"
  | "project-deleted"
  | "entry-deleted"
  | "entry-public"
  | "entry-private"
  | "generic";

export interface SupportiveToastCopy {
  title: string;
  message: string;
  emphasis?: string;
}

interface ResolveSupportiveToastInput {
  type: ToastType;
  rewardIntensity: UiPreferences["rewardIntensity"];
  fallbackMessage: string;
  copyKey?: ToastCopyKey;
}

const supportiveTitles: Record<ToastType, string> = {
  success: "Nice momentum",
  error: "Quick reset",
  info: "Heads up",
};

const fullIntensityTitles: Record<ToastType, string> = {
  success: "Great work",
  error: "Still on track",
  info: "Progress update",
};

const supportiveMessages: Record<ToastCopyKey, Partial<Record<ToastType, string>>> = {
  "import-success": {
    success: "Your data is safely back in the flow.",
  },
  "import-error": {
    error: "No worries—check the file and try again.",
  },
  "project-deleted": {
    success: "Project removed. Your workspace is cleaner now.",
  },
  "entry-deleted": {
    success: "Entry removed. You can always add a cleaner version next.",
  },
  "entry-public": {
    info: "This entry is now visible on your portfolio.",
  },
  "entry-private": {
    info: "This entry is now editor-only.",
  },
  generic: {},
};

/**
 * Compute the supportive toast text (title, message, and optional emphasis) for a UI notification.
 *
 * @param type - The toast category (`"success" | "error" | "info"`) that determines tone and title selection.
 * @param rewardIntensity - User preference controlling verbosity; when `"off"` the function returns a minimal title and the provided `fallbackMessage`.
 * @param fallbackMessage - Message to use when no keyed message exists for the given `copyKey` and `type`.
 * @param copyKey - Optional key selecting a predefined message variant; defaults to `"generic"`.
 * @returns An object with `title` (chosen by `type` and `rewardIntensity`), `message` (the keyed message if available, otherwise `fallbackMessage`), and `emphasis` (set to `"Keep building."` only when `rewardIntensity` is `"full"` and `type` is `"success"`). 
 */
export function resolveSupportiveToastCopy({
  type,
  rewardIntensity,
  fallbackMessage,
  copyKey = "generic",
}: ResolveSupportiveToastInput): SupportiveToastCopy {
  if (rewardIntensity === "off") {
    return {
      title: type === "error" ? "Error" : type === "success" ? "Success" : "Update",
      message: fallbackMessage,
    };
  }

  const baseTitle =
    rewardIntensity === "full" ? fullIntensityTitles[type] : supportiveTitles[type];

  const keyedMessage = supportiveMessages[copyKey]?.[type];

  return {
    title: baseTitle,
    message: keyedMessage ?? fallbackMessage,
    emphasis:
      rewardIntensity === "full" && type === "success"
        ? "Keep building."
        : undefined,
  };
}