"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const ThemeContext = createContext<{
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}>({
    theme: "light",
    setTheme: () => { },
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState("light");

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const ThemedComponent = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <div
            style={{
                backgroundColor: theme === "light" ? "#fff" : "#000",
                color: theme === "light" ? "#000" : "#fff",
                padding: 20,
            }}
        >
            <p>Current theme: {theme}</p>
            <button
                style={{
                    width: "100%",
                    padding: 8,
                    fontSize: 20,
                    margin: "20px 0",
                    backgroundColor: theme === "light" ? "#000" : "#fff",
                    color: theme === "light" ? "#fff" : "#000",
                    border: "none",
                }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
                Toggle Theme
            </button>
        </div>
    );
};

export default function ThemePage() {
    return (
        <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 24 }}>
            <ThemeProvider>
                <ThemedComponent />
            </ThemeProvider>
        </div>
    );
}
