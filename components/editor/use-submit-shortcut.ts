"use client";

import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";

export function useSubmitShortcut(formRef: RefObject<HTMLFormElement | null>) {
    const [shortcutLabel, setShortcutLabel] = useState("Ctrl+Enter");

    useEffect(() => {
        const platform = navigator.platform || navigator.userAgent;
        if (/Mac|iPhone|iPad|iPod/i.test(platform)) setShortcutLabel("⌘↵");
    }, []);

    const onSubmitShortcut = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    return { shortcutLabel, onSubmitShortcut };
}
