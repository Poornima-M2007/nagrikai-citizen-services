import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/common";
import { Logo } from "@/components/layout/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — NagrikAI" },
      { name: "description", content: "Sign in to NagrikAI to save schemes and documents." },
      { property: "og:title", content: "Login or Sign Up — NagrikAI" },
      { property: "og:description", content: "Access your NagrikAI dashboard." },
    ],
  }),
  component: Auth,
});

type Mode = "login" | "signup" | "forgot";
export const authSchemas = {
  login: z.object({ email: z.string().trim().email("Enter a valid email"), password: z.string().min(1, "Enter your password") }),
  signup: z.object({ name: z.string().trim().min(2, "Enter your name").max(80), email: z.string().trim().email("Enter a valid email"), password: z.string().min(8, "Use at least 8 characters") }),
  forgot: z.object({ email: z.string().trim().email("Enter a valid email") }),
};

function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const r = authSchemas[mode].safeParse(values);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setNotice("Accounts are not connected yet, so you have not been signed in. Sign-in will work once the backend is enabled.");
  };

  const field = (k: "name" | "email" | "password", label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} aria-invalid={!!errors[k]} className="h-11 rounded-xl" />
      {errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="bg-gradient-hero">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-3xl border bg-card p-8 shadow-elegant">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-primary">{mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}</h1>
          {mode !== "forgot" && (
            <div className="mt-5 grid grid-cols-2 rounded-xl bg-secondary p-1 text-sm font-medium">
              {(["login", "signup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMode(m); setErrors({}); setNotice(null); }} className={`rounded-lg py-2 ${mode === m ? "bg-card shadow-soft text-primary" : "text-muted-foreground"}`}>{m === "login" ? "Login" : "Sign up"}</button>
              ))}
            </div>
          )}
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {mode === "signup" && field("name", "Full name")}
            {field("email", "Email", "email")}
            {mode !== "forgot" && field("password", "Password", "password")}
            {mode === "login" && <button type="button" onClick={() => { setMode("forgot"); setNotice(null); }} className="text-sm font-medium text-accent hover:underline">Forgot password?</button>}
            <Button type="submit" variant="hero" size="lg" className="w-full">{mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Send reset link"}</Button>
            {mode === "forgot" && <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground">Back to login</button>}
          </form>
          {notice && <div className="mt-5"><Notice tone="warn">{notice}</Notice></div>}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground"><Link to="/" className="hover:text-foreground">← Back to home</Link></p>
      </div>
    </div>
  );
}
