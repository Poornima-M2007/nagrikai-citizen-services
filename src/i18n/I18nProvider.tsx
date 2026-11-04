import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DICTIONARIES, LANGUAGES, type LangCode, type TKey } from "./translations";

type Ctx = { lang: LangCode; setLang: (l: LangCode) => void; t: (k: TKey) => string };
const I18nContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "nagrikai.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((k: TKey) => DICTIONARIES[lang][k] ?? DICTIONARIES.en[k], [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
