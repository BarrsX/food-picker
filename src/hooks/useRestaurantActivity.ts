import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getInitialSyncStatus,
  removeFavoriteRestaurant,
  syncFavoriteRestaurant,
  syncPickHistoryEntry,
  type SyncStatus,
} from "../services/restaurantSync";
import type { PickHistoryEntry } from "../types/activity";
import type { Restaurant } from "../types/restaurant";

const FAVORITES_STORAGE_KEY = "food-picker:favorites:v2";
const HISTORY_STORAGE_KEY = "food-picker:history:v2";
const MAX_FAVORITES = 18;
const MAX_HISTORY = 10;

function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useRestaurantActivity() {
  const [favorites, setFavorites] = useState<Restaurant[]>(() =>
    readStorage(FAVORITES_STORAGE_KEY, [])
  );
  const [history, setHistory] = useState<PickHistoryEntry[]>(() =>
    readStorage(HISTORY_STORAGE_KEY, [])
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    getInitialSyncStatus()
  );

  useEffect(() => {
    writeStorage(FAVORITES_STORAGE_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    writeStorage(HISTORY_STORAGE_KEY, history);
  }, [history]);

  const favoriteNames = useMemo(
    () => new Set(favorites.map((restaurant) => restaurant.name)),
    [favorites]
  );

  const isFavorite = useCallback(
    (restaurantName: string) => favoriteNames.has(restaurantName),
    [favoriteNames]
  );

  const toggleFavorite = useCallback((restaurant: Restaurant) => {
    let shouldPersist = false;

    setFavorites((currentFavorites) => {
      const alreadySaved = currentFavorites.some(
        (favorite) => favorite.name === restaurant.name
      );
      shouldPersist = !alreadySaved;

      if (alreadySaved) {
        return currentFavorites.filter(
          (favorite) => favorite.name !== restaurant.name
        );
      }

      return [
        restaurant,
        ...currentFavorites.filter(
          (favorite) => favorite.name !== restaurant.name
        ),
      ].slice(0, MAX_FAVORITES);
    });

    void (shouldPersist
      ? syncFavoriteRestaurant(restaurant)
      : removeFavoriteRestaurant(restaurant.name)
    )
      .then(() => {
        setSyncStatus(getInitialSyncStatus());
      })
      .catch(() => {
        setSyncStatus("sync-error");
      });
  }, []);

  const recordPick = useCallback((restaurant: Restaurant) => {
    const entry: PickHistoryEntry = {
      id: `${restaurant.name}-${Date.now()}`,
      pickedAt: new Date().toISOString(),
      restaurant,
    };

    setHistory((currentHistory) =>
      [entry, ...currentHistory.filter((item) => item.restaurant.name !== restaurant.name)].slice(
        0,
        MAX_HISTORY
      )
    );

    void syncPickHistoryEntry(entry)
      .then(() => {
        setSyncStatus(getInitialSyncStatus());
      })
      .catch(() => {
        setSyncStatus("sync-error");
      });

    return entry;
  }, []);

  return {
    favorites,
    history,
    isFavorite,
    recordPick,
    syncStatus,
    toggleFavorite,
  };
}
