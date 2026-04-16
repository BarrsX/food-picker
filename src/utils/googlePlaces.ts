import type { Restaurant } from "../types/restaurant";
import { normalizePhone, priceLevelToNumber } from "./places";

const SEARCH_RADIUS_METERS = 50000;

interface EnrichedRestaurantResult {
  distance: string | null;
  restaurant: Restaurant;
  warning: string | null;
}

type PlacePeriod = {
  close?: { time?: string };
  open?: { day?: number; time?: string };
};

function createPlacesService() {
  return new google.maps.places.PlacesService(document.createElement("div"));
}

function searchPlace(
  service: google.maps.places.PlacesService,
  request: google.maps.places.TextSearchRequest
) {
  return new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
    service.textSearch(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results.length > 0
      ) {
        resolve(results);
        return;
      }

      reject(new Error("Unable to find place"));
    });
  });
}

function getPlaceDetails(
  service: google.maps.places.PlacesService,
  placeId: string
) {
  return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: [
          "place_id",
          "formatted_address",
          "international_phone_number",
          "website",
          "rating",
          "price_level",
          "opening_hours",
          "photos",
          "editorial_summary",
          "business_status",
        ],
      },
      (details, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          details
        ) {
          resolve(details);
          return;
        }

        reject(new Error("Unable to load place details"));
      }
    );
  });
}

function getDistanceLabel(
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
) {
  const distanceService = new google.maps.DistanceMatrixService();

  return new Promise<string | null>((resolve) => {
    distanceService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (
          status !== google.maps.DistanceMatrixStatus.OK ||
          !response?.rows?.[0]?.elements?.[0]
        ) {
          resolve(null);
          return;
        }

        const element = response.rows[0].elements[0];
        if (
          element.status !== "OK" ||
          !element.distance?.value ||
          !element.duration?.text
        ) {
          resolve(null);
          return;
        }

        const miles = (element.distance.value / 1609.344).toFixed(1);
        resolve(`${miles} mi • ${element.duration.text} drive`);
      }
    );
  });
}

function getOpenStatus(
  details: google.maps.places.PlaceResult
): boolean | undefined {
  try {
    const periods = details.opening_hours?.periods as PlacePeriod[] | undefined;
    if (!periods?.length) {
      return undefined;
    }

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todaysPeriods = periods.filter(
      (period) => period.open?.day === currentDay
    );

    if (!todaysPeriods.length) {
      return undefined;
    }

    return todaysPeriods.some((period) => {
      const openTime = period.open?.time
        ? parseInt(period.open.time.replace(":", ""), 10)
        : 0;
      const closeTime = period.close?.time
        ? parseInt(period.close.time.replace(":", ""), 10)
        : 2400;

      if (closeTime < openTime) {
        return currentTime >= openTime || currentTime < closeTime;
      }

      return currentTime >= openTime && currentTime < closeTime;
    });
  } catch {
    return undefined;
  }
}

export async function enrichRestaurantWithPlacesData(
  restaurant: Restaurant,
  userLocation: google.maps.LatLngLiteral
): Promise<EnrichedRestaurantResult> {
  if (typeof google === "undefined" || !google.maps?.places) {
    return {
      distance: null,
      restaurant,
      warning:
        "Picked a restaurant, but live place data is not available in this browser.",
    };
  }

  const service = createPlacesService();

  try {
    const results = await searchPlace(service, {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      query: restaurant.name,
      radius: SEARCH_RADIUS_METERS,
    });

    const placeResult = results[0];
    const location = placeResult.geometry?.location;

    if (!location) {
      return {
        distance: null,
        restaurant,
        warning:
          "Picked a restaurant, but Google could not confirm the exact listing.",
      };
    }

    const coordinates = { lat: location.lat(), lng: location.lng() };
    let enrichedRestaurant: Restaurant = {
      ...restaurant,
      ...coordinates,
      placeId: placeResult.place_id || undefined,
    };
    let warning: string | null = null;

    if (placeResult.place_id) {
      try {
        const details = await getPlaceDetails(service, placeResult.place_id);
        const detailsWithEditorialSummary = details as google.maps.places.PlaceResult & {
          editorial_summary?: { overview?: string };
        };

        enrichedRestaurant = {
          ...enrichedRestaurant,
          address: details.formatted_address || undefined,
          businessStatus: details.business_status as string | undefined,
          editorialSummary:
            detailsWithEditorialSummary.editorial_summary?.overview || undefined,
          isOpen: getOpenStatus(details),
          openingHours: details.opening_hours?.weekday_text || undefined,
          phoneNumber: normalizePhone(
            details.international_phone_number || undefined
          ),
          photos:
            details.photos
              ?.slice(0, 8)
              .map((photo) => photo.getUrl({ maxHeight: 720, maxWidth: 960 })) ||
            undefined,
          placeId: details.place_id || undefined,
          priceLevel: priceLevelToNumber(
            details.price_level as string | number | undefined
          ),
          rating:
            details.rating !== undefined ? Number(details.rating) : undefined,
          website: details.website || undefined,
        };
      } catch {
        warning =
          "Picked a restaurant, but only basic location details were available.";
      }
    }

    const distance = await getDistanceLabel(userLocation, coordinates);

    if (!distance && !warning) {
      warning =
        "Picked a restaurant, but travel time could not be calculated right now.";
    }

    return {
      distance,
      restaurant: enrichedRestaurant,
      warning,
    };
  } catch {
    return {
      distance: null,
      restaurant,
      warning:
        "Picked a restaurant, but Google could not confirm the exact listing.",
    };
  }
}
