import { Moon, Sun } from "lucide-react";
import { ICON_CONTROL } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      className={cn(ICON_CONTROL, className)}
    >
      {/* Both icons render so the prerendered HTML is right for either theme. */}
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </button>
  );
}
