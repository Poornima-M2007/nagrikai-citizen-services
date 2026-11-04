import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Pause, Play, Send, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice, PageHeader } from "@/components/common";
import { LANGUAGES, type LangCode } from "@/i18n/translations";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "AI Voice Assistant — NagrikAI" },
      { name: "description", content: "Ask about government services by voice in English, Hindi, Kannada, Telugu or Tamil." },
      { property: "og:title", content: "AI Voice Assistant — NagrikAI" },
      { property: "og:description", content: "Speak your question, hear the answer in your language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Voice,
});

const LOCALE: Record<LangCode, string> = { en: "en-IN", hi: "hi-IN", kn: "kn-IN", te: "te-IN", ta: "ta-IN" };
type Msg = { role: "user" | "system"; text: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;

function Voice() {
  const { lang: uiLang } = useI18n();
  const [lang, setLang] = useState<LangCode>(uiLang);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const recRef = useRef<SR>(null);

  useEffect(() => setLang(uiLang), [uiLang]);
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => { recRef.current?.abort?.(); window.speechSynthesis?.cancel(); };
  }, []);

  const send = (q: string) => {
    const v = q.trim();
    if (!v) return;
    setMsgs((m) => [...m, { role: "user", text: v }, { role: "system", text: "Your question was captured. AI answers will be available once the secure assistant service is connected — no answer has been generated." }]);
    setText("");
  };

  const start = () => {
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    setMicError(null);
    const rec = new Ctor();
    rec.lang = LOCALE[lang];
    rec.interimResults = true;
    rec.onresult = (e: SR) => {
      let fin = "", int = "";
      for (const r of e.results) (r.isFinal ? (fin += r[0].transcript) : (int += r[0].transcript));
      setInterim(int);
      if (fin) setText((t) => (t ? t + " " : "") + fin);
    };
    rec.onerror = (e: SR) => {
      setMicError(e.error === "not-allowed" || e.error === "service-not-allowed" ? "Microphone permission was denied. Allow microphone access in your browser settings, or type your question instead." : e.error === "no-speech" ? "No speech was detected. Please try again." : `Speech recognition error: ${e.error}`);
    };
    rec.onend = () => { setListening(false); setInterim(""); };
    recRef.current = rec;
    rec.start();
    setListening(true);
  };
  const stop = () => recRef.current?.stop();

  const speak = (t: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = LOCALE[lang];
    u.onend = () => { setSpeaking(false); setPaused(false); };
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <>
      <PageHeader eyebrow="AI Voice Assistant" title="Ask by voice, in your language" description="Speak or type your question about government services." />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">Speaking language
            <select value={lang} onChange={(e) => setLang(e.target.value as LangCode)} className="h-10 rounded-xl border bg-card px-3">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native} ({l.label})</option>)}
            </select>
          </label>
          {speaking && (
            <div className="flex gap-2">
              <Button variant="soft" size="sm" onClick={() => { if (paused) { speechSynthesis.resume(); setPaused(false); } else { speechSynthesis.pause(); setPaused(true); } }}>{paused ? <Play /> : <Pause />}{paused ? "Resume" : "Pause"}</Button>
              <Button variant="soft" size="sm" onClick={() => { speechSynthesis.cancel(); setSpeaking(false); }}><Square /> Stop</Button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center rounded-3xl border bg-card p-10 shadow-soft">
          {supported === false ? (
            <div className="text-center"><span className="mx-auto grid size-24 place-items-center rounded-full bg-muted"><MicOff className="size-10 text-muted-foreground" /></span>
              <p className="mt-4 font-semibold">Voice input isn't available in this browser</p><p className="mt-1 text-sm text-muted-foreground">Try Chrome or Edge, or type your question below.</p></div>
          ) : (
            <>
              <button onClick={listening ? stop : start} disabled={supported === null} aria-pressed={listening} aria-label={listening ? "Stop listening" : "Start speaking"}
                className={`relative grid size-28 place-items-center rounded-full bg-gradient-primary shadow-elegant transition hover:scale-105 ${listening ? "ring-8 ring-accent/30" : ""}`}>
                {listening && <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />}
                <Mic className="relative size-11 text-primary-foreground" />
              </button>
              <p className="mt-5 font-medium" aria-live="polite">{listening ? "Listening… tap to stop" : "Tap the microphone and speak"}</p>
              {interim && <p className="mt-2 italic text-muted-foreground">{interim}</p>}
            </>
          )}
          {micError && <div className="mt-5 w-full"><Notice tone="warn">{micError}</Notice></div>}
        </div>

        <section className="mt-6 rounded-2xl border bg-card shadow-soft">
          <div className="max-h-96 space-y-3 overflow-y-auto p-5">
            {msgs.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Your conversation will appear here.</p> : msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {m.text}
                  {m.role === "user" && <button onClick={() => speak(m.text)} className="ml-2 inline-flex align-middle opacity-80 hover:opacity-100" aria-label="Read aloud"><Volume2 className="size-4" /></button>}
                </div>
              </div>
            ))}
          </div>
          <form className="flex gap-2 border-t p-4" onSubmit={(e) => { e.preventDefault(); send(text); }}>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or speak your question…" className="h-11 rounded-xl" aria-label="Your question" />
            <Button type="submit" variant="hero" size="icon" className="size-11" disabled={!text.trim()} aria-label="Send"><Send /></Button>
          </form>
        </section>
      </div>
    </>
  );
}
