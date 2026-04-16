import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Restaurant } from "../types/restaurant";

function readInitialSearchQuery() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("search") || "";
}

function readInitialSelectedTypes(availableTypes: string[]) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const rawTypes = new URLSearchParams(window.location.search).get("types");
  if (!rawTypes) {
    return [] as string[];
  }

  return rawTypes
    .split(",")
    .map((type) => type.trim())
    .filter((type) => availableTypes.includes(type));
}

export function useRestaurantFilters(restaurants: Restaurant[]) {
  const types = useMemo(
    () =>
      Array.from(new Set(restaurants.map((restaurant) => restaurant.type))).sort(
        (left, right) => left.localeCompare(right)
      ),
    [restaurants]
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() =>
    readInitialSelectedTypes(types)
  );
  const [searchQuery, setSearchQuery] = useState(() => readInitialSearchQuery());
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const filtered = useMemo(
    () =>
      restaurants.filter((restaurant) => {
        const matchesType =
          selectedTypes.length === 0 || selectedTypes.includes(restaurant.type);

        if (!matchesType) {
          return false;
        }

        if (!deferredSearchQuery) {
          return true;
        }

        return `${restaurant.name} ${restaurant.type}`
          .toLowerCase()
          .includes(deferredSearchQuery);
      }),
    [deferredSearchQuery, restaurants, selectedTypes]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (selectedTypes.length > 0) {
      params.set("types", selectedTypes.join(","));
    } else {
      params.delete("types");
    }

    const nextSearch = searchQuery.trim();
    if (nextSearch) {
      params.set("search", nextSearch);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    const nextUrl = `${window.location.pathname}${
      query ? `?${query}` : ""
    }${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [searchQuery, selectedTypes]);

  const toggleType = useCallback((type: string) => {
    startTransition(() => {
      setSelectedTypes((currentTypes) =>
        currentTypes.includes(type)
          ? currentTypes.filter((selectedType) => selectedType !== type)
          : [...currentTypes, type].sort((left, right) =>
              left.localeCompare(right)
            )
      );
    });
  }, []);

  const selectAll = useCallback(() => {
    startTransition(() => {
      setSelectedTypes(types);
    });
  }, [types]);

  const clearAll = useCallback(() => {
    startTransition(() => {
      setSelectedTypes([]);
    });
  }, []);

  const updateSearchQuery = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  }, []);

  return {
    clearAll,
    filtered,
    searchQuery,
    selectAll,
    selectedTypes,
    setSearchQuery: updateSearchQuery,
    toggleType,
    types,
  };
}
