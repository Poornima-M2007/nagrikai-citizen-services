import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 bg-gradient-navy text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/75">{t("footer.tagline")}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-saffron">{t("footer.explore")}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="text-primary-foreground/80 hover:text-primary-foreground">{t(n.key)}</Link></li>
            ))}
            <li><Link to="/dashboard" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.dashboard")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-saffron">{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><Mail className="size-4 mt-0.5" /> contact@example.com (placeholder)</li>
            <li className="flex gap-2"><Phone className="size-4 mt-0.5" /> +91 00000 00000 (placeholder)</li>
            <li className="flex gap-2"><MapPin className="size-4 mt-0.5" /> Address to be added</li>
          </ul>
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
