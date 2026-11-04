import { useEffect, useState } from "react";

// Device-local saved schemes. Will move to the saved_schemes table once accounts are connected.
const KEY = "nagrikai.savedSchemes";
const EVENT = "nagrikai:saved-changed";

function read(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useSavedSchemes() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const toggle = (id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    return next.includes(id);
  };
  return { ids, toggle, isSaved: (id: string) => ids.includes(id) };
}
