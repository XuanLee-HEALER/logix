export interface Preferences {
  topicOrder: string[];
  columns: number;
}

export async function getPreferences(): Promise<Preferences | null> {
  const res = await fetch("/api/preferences");
  if (!res.ok) return null;
  const data = await res.json();
  // Empty object means no saved preferences
  if (!data.topicOrder) return null;
  return data as Preferences;
}

export async function putPreferences(prefs: Preferences): Promise<void> {
  await fetch("/api/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs),
  });
}
