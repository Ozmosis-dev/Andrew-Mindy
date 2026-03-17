"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        // Check localStorage or system preference on mount
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme("light");
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("light-mode");
        } else {
            root.classList.remove("light-mode");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
