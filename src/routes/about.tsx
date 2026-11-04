import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NagrikAI — Our Mission" },
      { name: "description", content: "Why NagrikAI exists: making government services understandable for every Indian citizen." },
      { property: "og:title", content: "About NagrikAI" },
      { property: "og:description", content: "Our mission to simplify government services for every citizen." },
    ],
  }),
  component: About,
});

const blocks = [
  { icon: Compass, title: "The problem", text: "Government schemes and notices are often written in complex official language, spread across many portals, and rarely available in the language a citizen is most comfortable with. Many eligible people never apply." },
  { icon: Target, title: "Our mission", text: "To make every government service understandable and reachable for every citizen — regardless of language, literacy or location." },
  { icon: HeartHandshake, title: "Our objectives", text: "Help citizens discover schemes they may qualify for, explain official documents in plain words, support voice interaction, and always point to the verified official source." },
  { icon: Users, title: "Benefits for citizens", text: "Less confusion, fewer wasted trips, faster applications and more confidence when dealing with government processes." },
];

function About() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Making government simple, for everyone" description="NagrikAI is an independent citizen-assistance platform. We are not a government body." />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
        {blocks.map((b) => (
          <section key={b.title} className="rounded-2xl border bg-card p-7 shadow-soft">
            <b.icon className="size-7 text-accent" />
            <h2 className="mt-4 text-xl font-semibold">{b.title}</h2>
            <p className="mt-2 text-muted-foreground">{b.text}</p>
          </section>
        ))}
        <div className="md:col-span-2 flex justify-center pt-4"><Button asChild variant="hero" size="lg"><Link to="/schemes">Start exploring schemes</Link></Button></div>
      </div>
    </>
  );
}
