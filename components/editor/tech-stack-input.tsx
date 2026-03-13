"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Command } from "cmdk";
import { useDevJournalStore } from "@/lib/store";

const COMMON_TECH_STACKS = [
    "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express",
    "Tailwind CSS", "PostgreSQL", "MongoDB", "Python", "Django", "Flask",
    "Go", "Rust", "Vue.js", "Svelte", "Docker", "Kubernetes", "AWS", "Vercel",
    "Supabase", "Firebase", "Prisma", "Drizzle", "GraphQL", "Redis"
];

interface TechStackInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export function TechStackInput({ value, onChange, placeholder = "e.g., React, TypeScript (press Space or Enter)" }: TechStackInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Get all unique tech stacks from user's existing projects
    const projects = useDevJournalStore((state) => state.projects);
    const userTechStacks = Array.from(new Set(projects.flatMap(p => p.techStack)));

    // Combine common ones with user's, remove duplicates
    const allSuggestions = Array.from(new Set([...userTechStacks, ...COMMON_TECH_STACKS]));

    // Filter suggestions that are already selected
    const availableSuggestions = allSuggestions.filter(tech => !value.includes(tech));

    const addTech = (techStr: string) => {
        const cleanTech = techStr.trim();
        if (cleanTech && !value.includes(cleanTech)) {
            onChange([...value, cleanTech]);
            setInputValue("");
            setIsOpen(false);
        }
    };

    const removeTech = (techToRemove: string) => {
        onChange(value.filter((tech) => tech !== techToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle input clearing
        if (e.key === "Backspace" && !inputValue && value.length > 0) {
            e.preventDefault();
            onChange(value.slice(0, -1));
        }

        // Auto-commit on Space or Comma (only if we're not using the dropdown actively with arrows)
        // If the dropdown is open and user is navigating, we shouldn't steal the enter/space.
        if ((e.key === "Enter" || e.key === " " || e.key === ",") && inputValue) {
            // Let the Command component handle Enter if dropdown is open and it has focus,
            // otherwise commit whatever is typed.
            if (e.key === " " || e.key === ",") {
                e.preventDefault();
                addTech(inputValue);
            }
            // For enter, we let CMD-K handle it if there's an active selection,
            // but we can also handle fallback if nothing is highlighted
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Command
            className="relative"
            shouldFilter={true}
            onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue && !isOpen) {
                     e.preventDefault();
                     addTech(inputValue);
                }
            }}
        >
            <div
                ref={containerRef}
                className="flex flex-wrap items-center gap-2 p-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-colors"
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tech, index) => (
                    <span
                        key={`${tech}-${index}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700/50 rounded-md text-sm text-zinc-200"
                    >
                        {tech}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTech(tech);
                            }}
                            className="text-zinc-500 hover:text-brand-400 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}

                <Command.Input
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={(val) => {
                        // Handle comma pasting/typing
                        if (val.endsWith(",")) {
                            addTech(val.slice(0, -1));
                        } else {
                            setInputValue(val);
                            setIsOpen(true);
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none py-1 px-1"
                    placeholder={value.length === 0 ? placeholder : "Add more..."}
                />
            </div>

            {isOpen && (inputValue.length > 0 || availableSuggestions.length > 0) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-md animate-in fade-in zoom-in-95">
                    <Command.List className="max-h-60 overflow-y-auto p-1">
                        <Command.Empty className="px-3 py-2 text-sm text-zinc-400 text-center">
                            Press Enter to add &quot;{inputValue}&quot;
                        </Command.Empty>
                        <Command.Group>
                            {/* If there's an input and it doesn't match an existing exact suggestion, show 'create new' option */}
                            {inputValue.trim() && !availableSuggestions.some(s => s.toLowerCase() === inputValue.trim().toLowerCase()) && (
                                <Command.Item
                                    value={inputValue}
                                    onSelect={() => addTech(inputValue)}
                                    className="flex cursor-pointer items-center px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 rounded-sm data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
                                >
                                    <span className="text-zinc-400 mr-2">Add</span> &quot;{inputValue}&quot;
                                </Command.Item>
                            )}

                            {availableSuggestions.map((tech) => (
                                <Command.Item
                                    key={tech}
                                    value={tech}
                                    onSelect={() => addTech(tech)}
                                    className="flex cursor-pointer items-center px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 rounded-sm data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100"
                                >
                                    {tech}
                                </Command.Item>
                            ))}
                        </Command.Group>
                    </Command.List>
                </div>
            )}
        </Command>
    );
}
