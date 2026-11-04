export function officialGovernmentUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    return /\.(gov|nic)\.in$/i.test(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

export type OfficialReference = { label: string; url: string; kind: "information" | "status" };

export function officialReferences(value: unknown): OfficialReference[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const url = officialGovernmentUrl(item.url);
    if (!url || typeof item.label !== "string" || !item.label.trim() || !["information", "status"].includes(item.kind)) return [];
    return [{ label: item.label, url, kind: item.kind } as OfficialReference];
  });
}