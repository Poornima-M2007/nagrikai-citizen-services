import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Bell, FileText, Languages, Lock, Mic, MousePointerClick, MessageSquareText, Search, Smartphone, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import heroImg from "@/assets/citizen-services-home.jpg";

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
      <section className="home-hero relative isolate overflow-hidden bg-navy-deep text-primary-foreground">
        <img src={heroImg} width={1920} height={1024} alt="Indian citizens reviewing a document together with an adviser" fetchPriority="high" className="home-hero-image absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="home-hero-shade absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="max-w-xl animate-rise">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/85"><span className="h-0.5 w-6 bg-saffron" aria-hidden />{t("hero.badge")}</p>
            <h1 className="mt-5 font-display text-2xl font-bold">Nagrik<span className="text-saffron">AI</span></h1>
            <p className="mt-3 font-display text-4xl font-bold leading-[1.18] sm:text-5xl">{t("hero.title")}</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/85 sm:text-lg">{t("hero.subtitle")}</p>
            <div className="home-actions mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="teal" className="group min-h-12 h-auto whitespace-normal rounded-lg px-5 py-3 text-left">
                <Link to="/schemes">{t("hero.ctaPrimary")} <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="soft" className="min-h-12 h-auto whitespace-normal rounded-lg px-5 py-3 text-left">
                <Link to="/documents"><FileText /> {t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b bg-card">
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {trust.map((item) => <li key={item.label} className="flex items-center gap-3 text-sm font-semibold sm:justify-center"><item.icon className="size-5 shrink-0 text-accent" aria-hidden />{item.label}</li>)}
        </ul>
      </section>

      {/* Quick access */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">{t("quick.title")}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{t("quick.subtitle")}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((q) => (
            <Link key={q.to} to={q.to} className="group relative flex flex-col overflow-hidden rounded-lg border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-primary transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
              <span className={`grid size-12 place-items-center rounded-lg shadow-soft ${q.tone}`}><q.icon className="size-6" aria-hidden /></span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{q.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{q.desc}</p>
              <span className="mt-7 inline-flex items-center justify-between gap-1.5 border-t pt-4 text-sm font-semibold text-primary">{t("quick.open")} <ArrowRight className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">{t("how.title")}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={i} className="border-t border-accent/30 pt-6">
                <div className="flex items-start justify-between">
                  <span className="font-display text-4xl font-semibold text-primary/35">0{i + 1}</span>
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
      <section className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("why.title")}</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {why.map((w) => (
                <div key={w.title} className="group">
                  <span className="grid size-12 place-items-center rounded-lg border border-primary-foreground/15 bg-primary-foreground/10">
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
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 md:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary md:text-4xl">{t("cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("cta.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="hero" className="group min-h-12 h-auto max-w-full whitespace-normal rounded-lg px-6 py-3 text-base">
              <Link to="/schemes">{t("hero.ctaPrimary")} <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
            </Button>
              <Button asChild size="lg" variant="soft" className="min-h-12 h-auto max-w-full whitespace-normal rounded-lg px-6 py-3 text-base">
              <Link to="/documents"><FileText /> {t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
