import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evita hydration mismatch — só renderiza o ícone correto no client
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" disabled>
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-accent/20 transition-all duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
                <Moon className="h-4 w-4 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
            )}
        </Button>
    );
}
