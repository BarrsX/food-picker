import { useMemo, useState } from "react";
import type { Restaurant } from "../types/restaurant";

export function useRestaurants(initial: Restaurant[]) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const types = useMemo(
    () => Array.from(new Set(initial.map((r) => r.type))).sort(),
    [initial]
  );

  const filtered = useMemo(
    () =>
      selectedTypes.length === 0
        ? initial
        : initial.filter((r) => selectedTypes.includes(r.type)),
    [selectedTypes, initial]
  );

  return { types, filtered, selectedTypes, setSelectedTypes };
}
