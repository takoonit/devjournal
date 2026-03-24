/**
 * A centralized logger utility for the application.
 * Currently uses console methods, but can be extended to use structured logging
 * or external services (e.g., Datadog, Sentry) in the future.
 */

export const logger = {
    info: (...args: any[]) => {
        console.log(...args);
    },
    warn: (...args: any[]) => {
        console.warn(...args);
    },
    error: (...args: any[]) => {
        console.error(...args);
    },
    debug: (...args: any[]) => {
        if (process.env.NODE_ENV !== "production") {
            console.debug(...args);
        }
    },
};
