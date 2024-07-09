import React, { useState } from "react";

type ThemeContextType = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => null,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const storedTheme = localStorage.getItem("theme");
  const currentTheme = storedTheme
    ? (storedTheme as "dark" | "light")
    : "light";
  const [theme, setTheme] = useState(currentTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);

      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${theme} text-foreground bg-background min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
