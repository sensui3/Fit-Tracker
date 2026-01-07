import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Set environment variables for tests
process.env.VITE_APP_URL = 'http://localhost:3000';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';

// Mock LogRocket
vi.mock('logrocket', () => ({
    default: {
        init: vi.fn(),
        identify: vi.fn(),
        log: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        captureException: vi.fn(),
    },
}));

// Mock better-auth/react to prevent "Invalid base URL" errors
vi.mock('better-auth/react', () => ({
    createAuthClient: vi.fn(() => ({
        signIn: {
            email: vi.fn(),
        },
        signUp: {
            email: vi.fn(),
        },
        useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
        signOut: vi.fn(),
    })),
    useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
    signOut: vi.fn(),
}));

// Mock auth-client specifically
vi.mock('./lib/auth-client', () => ({
    authClient: {
        signIn: {
            email: vi.fn(),
        },
        signUp: {
            email: vi.fn(),
        },
        useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
        signOut: vi.fn(),
    },
    useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
    signOut: vi.fn(),
    signInValidated: vi.fn(),
    signUpValidated: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key: string) => {
            delete store[key];
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock window.location
const locationMock = {
    ...window.location,
    href: '',
    reload: vi.fn(),
    assign: vi.fn(),
    replace: vi.fn(),
};

Object.defineProperty(window, 'location', {
    value: locationMock,
    writable: true,
});
