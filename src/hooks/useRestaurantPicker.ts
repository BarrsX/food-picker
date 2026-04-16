import { useCallback, useMemo, useState } from "react";
import type { Restaurant } from "../types/restaurant";
import { enrichRestaurantWithPlacesData } from "../utils/googlePlaces";

export interface PickerStatusMessage {
  severity: "error" | "warning";
  text: string;
}

interface UseRestaurantPickerOptions {
  mapsEnabled: boolean;
  placesReady: boolean;
  userLocation: google.maps.LatLngLiteral | null;
}

export function useRestaurantPicker({
  mapsEnabled,
  placesReady,
  userLocation,
}: UseRestaurantPickerOptions) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(
    null
  );
  const [distance, setDistance] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] =
    useState<PickerStatusMessage | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const mapCenter = useMemo(() => {
    if (
      selectedRestaurant?.lat === undefined ||
      selectedRestaurant.lng === undefined
    ) {
      return null;
    }

    return { lat: selectedRestaurant.lat, lng: selectedRestaurant.lng };
  }, [selectedRestaurant]);

  const showRestaurant = useCallback((restaurant: Restaurant) => {
    setDistance(null);
    setSelectedRestaurant(restaurant);
    setStatusMessage(null);
  }, []);

  const pickRandom = useCallback(
    async (restaurants: Restaurant[]) => {
      if (restaurants.length === 0) {
        setStatusMessage({
          severity: "error",
          text: "No restaurants match the current search and cuisine filters.",
        });
        return null;
      }

      const candidate =
        restaurants[Math.floor(Math.random() * restaurants.length)];

      setDistance(null);
      setIsPicking(true);
      setStatusMessage(null);

      try {
        if (!mapsEnabled) {
          setSelectedRestaurant(candidate);
          setStatusMessage({
            severity: "warning",
            text:
              "Maps are not configured in this deployment yet, so this pick is using the curated list only.",
          });
          return candidate;
        }

        if (!placesReady) {
          setSelectedRestaurant(candidate);
          setStatusMessage({
            severity: "warning",
            text:
              "Maps are still loading, so this pick is using the curated list for the moment.",
          });
          return candidate;
        }

        if (!userLocation) {
          setSelectedRestaurant(candidate);
          setStatusMessage({
            severity: "warning",
            text:
              "Location access is off, so travel time and directions are unavailable for this pick.",
          });
          return candidate;
        }

        const result = await enrichRestaurantWithPlacesData(
          candidate,
          userLocation
        );

        setDistance(result.distance);
        setSelectedRestaurant(result.restaurant);
        setStatusMessage(
          result.warning
            ? {
                severity: "warning",
                text: result.warning,
              }
            : null
        );

        return result.restaurant;
      } finally {
        setIsPicking(false);
      }
    },
    [mapsEnabled, placesReady, userLocation]
  );

  return {
    distance,
    isPicking,
    mapCenter,
    pickRandom,
    selectedRestaurant,
    showRestaurant,
    statusMessage,
  };
}
