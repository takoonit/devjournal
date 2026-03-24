import { useCallback, type RefObject } from "react";

export function useFocusTrap() {
    const trapFocus = useCallback((modalRef: RefObject<HTMLDivElement | null>, onClose: () => void) => {
        const modal = modalRef.current;
        if (!modal) return;

        const focusable = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length > 0) focusable[0].focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab") return;

            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        modal.addEventListener("keydown", handleKeyDown);
        return () => modal.removeEventListener("keydown", handleKeyDown);
    }, []);

    return trapFocus;
}
