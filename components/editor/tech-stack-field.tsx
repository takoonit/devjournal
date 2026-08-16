"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { inputClasses } from "@/components/ui/form-styles";
import { cn, parseTechStack } from "@/lib/utils";

export function TechStackField({ value, onChange, id = "project-tech" }: {
    value: string[];
    onChange: (value: string[]) => void;
    id?: string;
}) {
    const [input, setInput] = useState("");

    const addInput = (next = input) => {
        onChange(parseTechStack(value, next));
        setInput("");
    };

    return (
        <div>
            <label htmlFor={id} className="mb-2 block font-mono text-label uppercase text-text-secondary">
                Tech Stack
            </label>
            <div className="mb-3 flex gap-2">
                <input
                    id={id}
                    type="text"
                    value={input}
                    onChange={(event) => {
                        const next = event.target.value;
                        if (next.includes(",")) addInput(next);
                        else setInput(next);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            addInput();
                        }
                    }}
                    className={cn(inputClasses, "flex-1 font-mono")}
                    placeholder="React, TypeScript, Next.js"
                />
                <button
                    type="button"
                    onClick={() => addInput()}
                    className="control-target rounded-md border border-surface-border px-3.5 text-text-secondary transition-colors duration-subtle hover:border-text-secondary hover:text-text-primary"
                    aria-label="Add technology"
                >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                </button>
            </div>
            {value.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {value.map((tech, index) => (
                        <span key={`${tech}-${index}`} className="inline-flex items-center gap-2 rounded border border-surface-border px-2.5 py-1 font-mono text-meta text-text-secondary">
                            {tech}
                            <button
                                type="button"
                                onClick={() => onChange(value.filter((item) => item !== tech))}
                                className="control-target -my-2 -mr-2 text-text-muted transition-colors duration-subtle hover:text-destructive"
                                aria-label={`Remove ${tech}`}
                            >
                                <X className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
