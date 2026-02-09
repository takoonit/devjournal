import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                noir: {
                    950: "#060010",
                    900: "#0a0018",
                    800: "#12001f",
                    700: "#1a0029",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "monospace"],
            },
            animation: {
                "spotlight": "spotlight 2s ease infinite",
                "blur-in": "blur-in 0.5s ease-out forwards",
            },
            keyframes: {
                spotlight: {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
                "blur-in": {
                    "0%": { filter: "blur(10px)", opacity: "0" },
                    "100%": { filter: "blur(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
