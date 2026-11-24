"use client";

/**
 * Ascultător invizibil pe pagina publică: când conținutul se salvează din
 * panoul de administrare (deschis într-un alt tab/fereastră), pagina publică
 * se reîmprospătează automat, fără reload manual.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onContentUpdated } from "@/lib/broadcast";

export function ContentRefreshListener() {
  const router = useRouter();

  useEffect(() => onContentUpdated(() => router.refresh()), [router]);

  return null;
}
