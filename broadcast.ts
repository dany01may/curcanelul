/**
 * Notificare cross-tab: când conținutul site-ului se schimbă din panoul de
 * administrare (deschis într-o fereastră/tab separat), tab-ul cu site-ul
 * public este anunțat ca să se reîmprospăteze instant, fără reload manual.
 *
 * Se folosesc două canale complementare:
 *  - BroadcastChannel (modern, direc't între tab-uri)
 *  - localStorage „storage" event (fallback pentru browsere mai vechi)
 */

const CHANNEL_NAME = "curcanelul-content-updated";
const STORAGE_KEY = "curcanelul-content-updated-at";

/** Anunță toate celelalte tab-uri că sectiunile site-ului s-au schimbat. */
export function broadcastContentUpdated(): void {
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: "content-updated", at: Date.now() });
      channel.close();
    }
  } catch {
    // BroadcastChannel indisponibil / blocat — cădem pe fallback-ul de mai jos
  }
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // localStorage indisponibil (privacy mode) — nu e critic
  }
}

/** Ascultător pentru anunțurile de conținut actualizat. Returnează unbind. */
export function onContentUpdated(handler: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent) => {
        if (event.data?.type === "content-updated") handler();
      };
    }
  } catch {
    channel = null;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) handler();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
    if (channel) {
      channel.onmessage = null;
      channel.close();
    }
  };
}
