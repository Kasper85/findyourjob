import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="relative h-7 w-7 rounded-md bg-primary grid place-items-center">
        <span className="font-mono font-bold text-primary-foreground text-sm">{"{}"}</span>
      </div>
      {showText && (
        <span className="font-bold tracking-tight text-foreground">
          Find Your Job<span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
