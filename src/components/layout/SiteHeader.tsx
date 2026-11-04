import { Link } from "@tanstack/react-router";
import { Globe, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { LANGUAGES, type LangCode, type TKey } from "@/i18n/translations";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";

export const NAV: { to: "/" | "/schemes" | "/documents" | "/voice" | "/updates" | "/about"; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/schemes", key: "nav.schemes" },
  { to: "/documents", key: "nav.documents" },
  { to: "/voice", key: "nav.voice" },
  { to: "/updates", key: "nav.updates" },
  { to: "/about", key: "nav.about" },
];

function LanguageSelect({ id }: { id: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <label htmlFor={id} className="flex items-center gap-1.5 rounded-xl border bg-card px-2.5 h-9 text-sm">
      <Globe className="size-4 text-accent" aria-hidden />
      <span className="sr-only">{t("nav.language")}</span>
      <select
        id={id}
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="bg-transparent outline-none cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.native}</option>
        ))}
      </select>
    </label>
  );
}

function AccountButton({ onDone, className }: { onDone?: () => void; className?: string }) {
  const { t } = useI18n();
  const { user } = useAuth();
  if (user) return <Button asChild variant="hero" className={className}><Link to="/dashboard" onClick={onDone}>{t("nav.dashboard")}</Link></Button>;
  return <Button asChild variant="hero" className={className}><Link to="/auth" onClick={onDone}>{t("nav.login")}</Link></Button>;
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const linkCls = "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors";
  const activeCls = "text-primary bg-secondary";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="tricolor-bar h-1" aria-hidden />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0" aria-label="NagrikAI home"><Logo /></Link>
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: n.to === "/" }}>
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-2">
          <LanguageSelect id="lang-desktop" />
          <AccountButton />
        </div>
        <Button ref={menuButton} variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={t("nav.toggleMenu")}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="xl:hidden border-t bg-background animate-rise">
          <nav id="mobile-navigation" className="mx-auto flex max-w-7xl flex-col gap-1 p-4" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: n.to === "/" }}>
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <LanguageSelect id="lang-mobile" />
              <AccountButton className="flex-1" onDone={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
