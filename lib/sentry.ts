import * as Sentry from "@sentry/react";
import { scrubData } from "./security";

const DSN = import.meta.env.VITE_SENTRY_DSN;
const ENV = import.meta.env.MODE || 'development';

export const initSentry = () => {
    if (!DSN) {
        console.warn("Sentry DSN mapping missing. Sentry integration disabled.");
        return;
    }

    Sentry.init({
        dsn: DSN,
        environment: ENV,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: ENV === 'production' ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        // Data Scrubbing
        beforeSend(event) {
            return scrubData(event);
        },
        beforeBreadcrumb(breadcrumb) {
            return scrubData(breadcrumb);
        },
    });
};

export const setSentryUser = (user: { id: string; email?: string; name?: string } | null) => {
    if (user) {
        Sentry.setUser({
            id: user.id,
            email: user.email,
            username: user.name,
        });
    } else {
        Sentry.setUser(null);
    }
};

export const logDomainError = (error: Error, context: string, extra?: any) => {
    Sentry.withScope((scope) => {
        scope.setTag("context", context);
        if (extra) {
            scope.setExtra("details", extra);
        }
        Sentry.captureException(error);
    });
};
