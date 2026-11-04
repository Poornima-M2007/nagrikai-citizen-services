import { Link } from "@tanstack/react-router";
import { Mail, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-navy-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_1.4fr_0.8fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/75">{t("footer.tagline")}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-saffron">{t("footer.explore")}</h3>
          <ul className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="inline-flex items-center gap-2 text-primary-foreground/80 underline-offset-4 hover:text-primary-foreground hover:underline">{t(n.key)}<ArrowUpRight className="size-3 shrink-0 text-primary-foreground/50" aria-hidden /></Link></li>
            ))}
            <li><Link to="/dashboard" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.dashboard")}</Link></li>
            <li><Link to="/auth" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.login")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-saffron">{t("footer.contact")}</h3>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-primary-foreground/75"><Mail className="mt-1 size-4 shrink-0" aria-hidden />{t("footer.contactPending")}</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs leading-relaxed text-primary-foreground/65 sm:px-6">
          {t("footer.disclaimer")} © {new Date().getFullYear()} NagrikAI.
        </p>
      </div>
    </footer>
  );
}
