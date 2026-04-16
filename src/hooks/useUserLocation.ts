import { useEffect, useState } from "react";

export function useUserLocation() {
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location access is unavailable in this browser, so travel time and directions are hidden."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationMessage(null);
      },
      (error) => {
        let message =
          "Location access is off, so travel time and directions are unavailable.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location permission was denied, so travel time and directions are unavailable.";
            break;
          case error.POSITION_UNAVAILABLE:
            message =
              "Your location could not be determined, so travel time is hidden.";
            break;
          case error.TIMEOUT:
            message =
              "Location lookup timed out, so travel time and directions are hidden.";
            break;
          default:
            break;
        }

        setLocationMessage(message);
        setUserLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  return {
    locationMessage,
    userLocation,
  };
}
