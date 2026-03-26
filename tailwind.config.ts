import type { Config } from "tailwindcss";

const config: Config = {
content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
 theme: {
  extend: {
   colors: {
    primary: {
     DEFAULT: "var(--color-primary)",
     dark: "var(--color-primary-dark)"
    },
    secondary: "var(--color-secondary)",
    accent: "var(--color-accent)",
    bg: "var(--color-bg)",
    surface: "var(--color-surface)",
    "text-main": "var(--color-text-main)",
    "text-muted": "var(--color-text-muted)",
    border: "var(--color-border)",
    error: "var(--color-error)",
    warning: "var(--color-warning)",
    success: "var(--color-success)"
   },
   boxShadow: {
    brutal: "var(--brutal-shadow)",
    "brutal-sm": "var(--brutal-shadow-active)"
   },
   borderWidth: {
    brutal: "var(--brutal-border-width)"
   },
   borderRadius: {
    brutal: "var(--brutal-radius)"
   }
  }
 },
 plugins: []
};

export default config;
