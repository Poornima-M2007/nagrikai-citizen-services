import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Bell, FileText, Languages, Lock, Mic, MousePointerClick, MessageSquareText, Search, Smartphone, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import heroImg from "@/assets/hero-citizens.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NagrikAI — Government Services, Simplified" },
      { name: "description", content: "Discover government schemes, simplify official documents and get answers in your language with NagrikAI." },
      { property: "og:title", content: "NagrikAI — Government Services, Simplified" },
      { property: "og:description", content: "AI-powered multilingual citizen assistance for India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const quick = [
    { to: "/schemes" as const, icon: Search, title: t("quick.schemes"), desc: t("quick.schemesDesc"), tone: "bg-primary text-primary-foreground" },
    { to: "/documents" as const, icon: FileText, title: t("quick.docs"), desc: t("quick.docsDesc"), tone: "bg-accent text-accent-foreground" },
    { to: "/voice" as const, icon: Mic, title: t("quick.voice"), desc: t("quick.voiceDesc"), tone: "bg-saffron text-saffron-foreground" },
    { to: "/updates" as const, icon: Bell, title: t("quick.updates"), desc: t("quick.updatesDesc"), tone: "bg-success text-primary-foreground" },
  ];
  const steps = [
    { icon: MousePointerClick, title: t("how.s1"), desc: t("how.s1d") },
    { icon: MessageSquareText, title: t("how.s2"), desc: t("how.s2d") },
    { icon: Lightbulb, title: t("how.s3"), desc: t("how.s3d") },
  ];
  const why = [
    { icon: Languages, title: t("why.multi"), desc: t("why.multiD") },
    { icon: Sparkles, title: t("why.simple"), desc: t("why.simpleD") },
    { icon: Smartphone, title: t("why.access"), desc: t("why.accessD") },
    { icon: BadgeCheck, title: t("why.verified"), desc: t("why.verifiedD") },
  ];
  const trust = [
    { icon: Languages, label: t("trust.languages") },
    { icon: BadgeCheck, label: t("trust.sources") },
    { icon: Lock, label: t("trust.private") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="pointer-events-none absolute -top-24 right-[-10%] size-[28rem] rounded-full bg-accent/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-[-8%] size-[24rem] rounded-full bg-saffron/15 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3.5 py-1.5 text-sm font-medium text-primary shadow-soft backdrop-blur">
              <span className="size-2 rounded-full bg-saffron animate-soft-pulse" /> {t("hero.badge")}
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.06] tracking-tight text-primary sm:text-5xl lg:text-[3.6rem]">{t("hero.title")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero" className="group h-12 px-7 text-base">
                <Link to="/schemes">{t("hero.ctaPrimary")} <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="soft" className="h-12 px-7 text-base">
                <Link to="/documents"><FileText /> {t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3" aria-label="Platform highlights">
              {trust.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <item.icon className="size-4 text-accent" aria-hidden /> {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative animate-rise [animation-delay:150ms]">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-accent/10 blur-2xl" aria-hidden />
            <img src={heroImg} width={1280} height={1024} alt="Citizens asking NagrikAI about schemes, documents and pensions" className="relative w-full rounded-3xl border bg-card shadow-elegant" />
            <div className="absolute -bottom-5 -left-3 hidden animate-float items-center gap-3 rounded-2xl border bg-card/95 px-4 py-3 shadow-elegant backdrop-blur sm:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-accent/10"><BadgeCheck className="size-5 text-accent" aria-hidden /></span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t("hero.floatTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("hero.floatDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">{t("quick.title")}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{t("quick.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((q) => (
            <Link key={q.to} to={q.to} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-elegant">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-primary transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
              <span className={`grid size-12 place-items-center rounded-xl shadow-soft transition-transform duration-300 group-hover:scale-110 ${q.tone}`}><q.icon className="size-6" /></span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{q.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{q.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">{t("quick.open")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">{t("how.title")}</h2>
          <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
            <span className="pointer-events-none absolute left-[16%] right-[16%] top-16 hidden border-t-2 border-dashed border-accent/30 md:block" aria-hidden />
            {steps.map((s, i) => (
              <li key={i} className="relative rounded-2xl bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-elegant">
                <div className="flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-primary font-display text-xl font-extrabold text-primary-foreground shadow-elegant">{i + 1}</span>
                  <s.icon className="mt-1 size-7 text-accent" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why NagrikAI */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-navy p-8 text-primary-foreground md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-saffron/15 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("why.title")}</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {why.map((w) => (
                <div key={w.title} className="group">
                  <span className="grid size-12 place-items-center rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 transition-colors duration-300 group-hover:bg-primary-foreground/15">
                    <w.icon className="size-5 text-saffron" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/75">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border bg-card p-10 text-center shadow-soft md:p-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary md:text-4xl">{t("cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("cta.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="hero" className="group h-12 px-7 text-base">
              <Link to="/schemes">{t("hero.ctaPrimary")} <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="soft" className="h-12 px-7 text-base">
              <Link to="/documents"><FileText /> {t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
