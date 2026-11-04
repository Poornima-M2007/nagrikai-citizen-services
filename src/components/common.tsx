import { FlaskConical, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SampleBadge({ label = "Sample data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-saffron/15 px-2.5 py-0.5 text-xs font-semibold text-saffron-foreground">
      <FlaskConical className="size-3" aria-hidden /> {label}
    </span>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="bg-gradient-hero border-b">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 animate-rise">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-bold text-primary md:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>}
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card p-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary"><Icon className="size-6 text-accent" /></span>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tone === "warn" ? "border-saffron/40 bg-saffron/10 text-saffron-foreground" : "border-accent/30 bg-accent/10 text-foreground"}`} role="note">
      {children}
    </div>
  );
}
