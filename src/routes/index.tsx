import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Bell, FileText, Languages, Mic, MousePointerClick, MessageSquareText, Search, Smartphone, Sparkles, Lightbulb } from "lucide-react";
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

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-primary shadow-soft">
              <span className="size-2 rounded-full bg-saffron" /> {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-primary sm:text-5xl lg:text-6xl">{t("hero.title")}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero"><Link to="/schemes">{t("hero.ctaPrimary")} <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="soft"><Link to="/documents"><FileText /> {t("hero.ctaSecondary")}</Link></Button>
            </div>
          </div>
          <div className="relative animate-rise [animation-delay:150ms]">
            <div className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl" aria-hidden />
            <img src={heroImg} width={1280} height={1024} alt="Citizens asking NagrikAI about schemes, documents and pensions" className="relative rounded-3xl border bg-card shadow-elegant" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold text-primary md:text-4xl">{t("quick.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("quick.subtitle")}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((q) => (
            <Link key={q.to} to={q.to} className="group flex flex-col rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <span className={`grid size-12 place-items-center rounded-xl ${q.tone}`}><q.icon className="size-6" /></span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{q.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{q.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">{t("quick.open")} <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">{t("how.title")}</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={i} className="relative rounded-2xl bg-card p-7 shadow-soft">
                <span className="font-display text-5xl font-extrabold text-saffron/40">0{i + 1}</span>
                <s.icon className="absolute right-7 top-8 size-7 text-accent" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-navy p-8 text-primary-foreground md:p-14">
          <h2 className="text-3xl font-bold md:text-4xl">{t("why.title")}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.title}>
                <span className="grid size-11 place-items-center rounded-xl bg-primary-foreground/10"><w.icon className="size-5 text-saffron" /></span>
                <h3 className="mt-4 font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/75">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
