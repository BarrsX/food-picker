import type { PickHistoryEntry } from "../types/activity";
import type { Restaurant } from "../types/restaurant";

export type SyncStatus = "local-only" | "sync-ready" | "sync-error";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function getInitialSyncStatus(): SyncStatus {
  return isSupabaseConfigured() ? "sync-ready" : "local-only";
}

function buildHeaders(prefer?: string) {
  const headers = new Headers({
    apikey: SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${SUPABASE_ANON_KEY || ""}`,
    "Content-Type": "application/json",
  });

  if (prefer) {
    headers.set("Prefer", prefer);
  }

  return headers;
}

async function syncTable(path: string, options: RequestInit) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, options);
  if (!response.ok) {
    throw new Error(`Failed to sync ${path}`);
  }
}

export async function syncFavoriteRestaurant(restaurant: Restaurant) {
  if (!isSupabaseConfigured()) {
    return;
  }

  await syncTable("favorite_restaurants", {
    method: "POST",
    headers: buildHeaders("resolution=merge-duplicates,return=minimal"),
    body: JSON.stringify({
      restaurant_name: restaurant.name,
      restaurant_type: restaurant.type,
      address: restaurant.address || null,
      website: restaurant.website || null,
      rating: restaurant.rating || null,
      price_level: restaurant.priceLevel || null,
      metadata: {
        editorialSummary: restaurant.editorialSummary || null,
        phoneNumber: restaurant.phoneNumber || null,
        photos: restaurant.photos || [],
        lat: restaurant.lat || null,
        lng: restaurant.lng || null,
      },
    }),
  });
}

export async function removeFavoriteRestaurant(restaurantName: string) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const params = new URLSearchParams({
    restaurant_name: `eq.${restaurantName}`,
  });

  await syncTable(`favorite_restaurants?${params.toString()}`, {
    method: "DELETE",
    headers: buildHeaders("return=minimal"),
  });
}

export async function syncPickHistoryEntry(entry: PickHistoryEntry) {
  if (!isSupabaseConfigured()) {
    return;
  }

  await syncTable("picker_events", {
    method: "POST",
    headers: buildHeaders("return=minimal"),
    body: JSON.stringify({
      event_id: entry.id,
      picked_at: entry.pickedAt,
      restaurant_name: entry.restaurant.name,
      restaurant_type: entry.restaurant.type,
      rating: entry.restaurant.rating || null,
      price_level: entry.restaurant.priceLevel || null,
      metadata: {
        address: entry.restaurant.address || null,
        website: entry.restaurant.website || null,
        lat: entry.restaurant.lat || null,
        lng: entry.restaurant.lng || null,
      },
    }),
  });
}
