"use client";

import { useSyncExternalStore } from "react";

const query = "(max-width: 900px), (prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Skip long reveal sequences and costly transforms on smaller devices.
export function useQuietMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
