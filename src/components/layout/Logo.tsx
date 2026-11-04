import { Sparkles } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary shadow-elegant">
        <Sparkles className="size-5 text-primary-foreground" aria-hidden />
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${inverted ? "text-primary-foreground" : "text-primary"}`}>
        Nagrik<span className="text-saffron">AI</span>
      </span>
    </span>
  );
}
