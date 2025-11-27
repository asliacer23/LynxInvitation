import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const root = document.documentElement;
    
    let initialTheme: "light" | "dark";
    
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = root.classList.contains("dark") ? "dark" : "light";
    }
    
    // Apply the theme
    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted || theme === null) return;
    
    const root = document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Update DOM
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || theme === null) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="cyber-glow-hover rounded-full"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="cyber-glow-hover rounded-full transition-colors hover:bg-secondary"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
