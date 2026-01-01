/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#16a34a', // Green 600 - Standard
                    hover: '#15803d',
                    light: '#dcfce7',
                    neon: '#13ec13', // For dark mode highlights
                },
                background: {
                    light: '#f8fafc',
                    dark: '#102210',
                },
                surface: {
                    light: '#ffffff',
                    dark: '#1c271c',
                    darker: '#0a160a',
                },
                border: {
                    light: '#e2e8f0',
                    dark: '#283928',
                },
                text: {
                    secondary: '#64748b',
                    secondaryDark: '#9db99d',
                },
            },
            fontFamily: {
                display: ['Lexend', 'sans-serif'],
                body: ['Noto Sans', 'sans-serif'],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [],
}
