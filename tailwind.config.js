import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                "surface-bright": "#eff8ff",
                "outline": "#507c94",
                "surface-container-highest": "#b5e3ff",
                "on-primary-fixed-variant": "#00266e",
                "surface-container-high": "#c2e8ff",
                "on-tertiary-fixed": "#004a23",
                "on-tertiary": "#cdffd4",
                "on-surface-variant": "#346178",
                "on-primary-fixed": "#000000",
                "tertiary-container": "#6bfe9c",
                "primary-fixed": "#7b9cff",
                "on-secondary-fixed-variant": "#00586d",
                "on-secondary-container": "#004e61",
                "on-primary": "#f1f2ff",
                "primary-container": "#7b9cff",
                "tertiary-dim": "#005c2d",
                "primary-fixed-dim": "#658eff",
                "inverse-on-surface": "#77a3bc",
                "tertiary-fixed-dim": "#5bef90",
                "on-error-container": "#570008",
                "secondary-fixed": "#80deff",
                "inverse-surface": "#001019",
                "secondary-fixed-dim": "#37d4ff",
                "primary": "#0050d4",
                "surface": "#eff8ff",
                "on-primary-container": "#001e5a",
                "on-error": "#ffefee",
                "on-background": "#003346",
                "tertiary": "#006a35",
                "on-tertiary-fixed-variant": "#006a35",
                "surface-dim": "#9fdcff",
                "background": "#eff8ff",
                "secondary-dim": "#00576c",
                "inverse-primary": "#618bff",
                "on-surface": "#003346",
                "surface-variant": "#b5e3ff",
                "error-dim": "#9f0519",
                "surface-container-lowest": "#ffffff",
                "secondary": "#00647b",
                "on-secondary-fixed": "#003a48",
                "on-secondary": "#e2f6ff",
                "outline-variant": "#87b3cd",
                "surface-tint": "#0050d4",
                "on-tertiary-container": "#005f2f",
                "surface-container-low": "#e2f3ff",
                "surface-container": "#cfecff",
                "secondary-container": "#80deff",
                "tertiary-fixed": "#6bfe9c",
                "error": "#b31b25",
                "primary-dim": "#0046bb",
                "error-container": "#fb5151"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            fontFamily: {
                sans: ['Manrope', ...defaultTheme.fontFamily.sans],
                headline: ["Plus Jakarta Sans", ...defaultTheme.fontFamily.sans],
                body: ["Manrope", ...defaultTheme.fontFamily.sans],
                label: ["Manrope", ...defaultTheme.fontFamily.sans]
            }
        },
    },

    plugins: [forms],
};
