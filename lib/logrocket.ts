import LogRocket from 'logrocket';
import { scrubData } from "./security";

const APP_ID = import.meta.env.VITE_LOGROCKET_ID;

export const initLogRocket = () => {
    if (!APP_ID) {
        console.warn("LogRocket App ID missing. LogRocket integration disabled.");
        return;
    }

    LogRocket.init(APP_ID, {
        // Option to scrub data if needed, although LogRocket has its own sanitization
        // beforeSend is not directly equivalent but identify and redaction are handled differently in LogRocket
    });
};

export const setLogRocketUser = (user: { id: string; email?: string; name?: string } | null) => {
    if (user && APP_ID) {
        LogRocket.identify(user.id, {
            name: user.name,
            email: user.email,
        });
    }
};

export const logDomainError = (error: Error, context: string, extra?: any) => {
    if (APP_ID) {
        LogRocket.captureException(error, {
            tags: {
                context
            },
            extra
        });
    }
};
