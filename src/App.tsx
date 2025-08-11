import React, { useCallback, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Alert, Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import logo from "./logo.png";
import type { Restaurant } from "./types/restaurant";
import FiltersPanel from "./components/FiltersPanel";
import RestaurantDetails from "./components/RestaurantDetails";
import PhotoModal from "./components/PhotoModal";
import restaurantsData from "./data/restaurants";
import { useRestaurants } from "./hooks/useRestaurants";
import { normalizePhone, priceLevelToNumber } from "./utils/places";

const GOOGLE_MAP_ID = process.env.REACT_APP_GOOGLE_MAP_ID as string;

function App() {
  // Static, typed restaurants list
  const initialRestaurants = restaurantsData;
  const { types, filtered, selectedTypes, setSelectedTypes } = useRestaurants(initialRestaurants);

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  // Load Places library via @vis.gl/react-google-maps
  const placesLib = useMapsLibrary("places");
  const placesReady = Boolean(placesLib);

  const handleTypeChange = useCallback((type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }, [setSelectedTypes]);

  const selectAllTypes = useCallback(() => setSelectedTypes(types), [types, setSelectedTypes]);
  const deselectAllTypes = useCallback(() => setSelectedTypes([]), [setSelectedTypes]);

  const handlePhotoClick = useCallback((photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setPhotoModalOpen(true);
  }, []);
  const handleClosePhotoModal = useCallback(() => {
    setPhotoModalOpen(false);
    setSelectedPhoto(null);
  }, []);

  const pickRandom = useCallback(async () => {
    if (filtered.length === 0) {
      setApiError("No restaurants match the selected criteria.");
      return;
    }

    setIsPicking(true);
    setApiError(null);
    setDistance(null);
    setMapCenter(null);

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selected = filtered[randomIndex];

    if (userLocation && placesReady) {
      try {
        // Use stable PlacesService API
        const dummyMapDiv = document.createElement("div");
        const service = new google.maps.places.PlacesService(dummyMapDiv);

        const textSearchReq: google.maps.places.TextSearchRequest = {
          query: selected.name,
          location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
          radius: 50000,
        };

        service.textSearch(textSearchReq, (results, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            setApiError("Could not find the exact location of the restaurant.");
            setSelectedRestaurant(selected);
            setIsPicking(false);
            return;
          }

          const placeResult = results[0];
          const loc = placeResult.geometry?.location;
          if (!loc) {
            setApiError("Could not find the exact location of the restaurant.");
            setSelectedRestaurant(selected);
            setIsPicking(false);
            return;
          }

          const newCenter = { lat: loc.lat(), lng: loc.lng() };
          setMapCenter(newCenter);

          if (placeResult.place_id) {
            const detailReq: google.maps.places.PlaceDetailsRequest = {
              placeId: placeResult.place_id,
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
            };
            service.getDetails(detailReq, (details, dStatus) => {
              if (dStatus === google.maps.places.PlacesServiceStatus.OK && details) {
                // Determine open status
                let isCurrentlyOpen: boolean | undefined = undefined;
                try {
                  const now = new Date();
                  const currentDay = now.getDay();
                  const currentTime = now.getHours() * 100 + now.getMinutes();
                  const periods = details.opening_hours?.periods as any[] | undefined;
                  if (periods && periods.length > 0) {
                    const todays = periods.filter((p: any) => p.open?.day === currentDay);
                    if (todays.length > 0) {
                      isCurrentlyOpen = todays.some((p: any) => {
                        const openTime = p.open?.time ? parseInt(String(p.open.time).replace(":", ""), 10) : 0;
                        const closeTime = p.close?.time ? parseInt(String(p.close.time).replace(":", ""), 10) : 2400;
                        return closeTime < openTime
                          ? currentTime >= openTime || currentTime < closeTime
                          : currentTime >= openTime && currentTime < closeTime;
                      });
                    }
                  }
                } catch {}

                const enhanced: Restaurant = {
                  ...selected,
                  placeId: details.place_id || undefined,
                  address: details.formatted_address || undefined,
                  phoneNumber: normalizePhone(details.international_phone_number || undefined),
                  website: details.website || undefined,
                  rating: details.rating !== undefined ? Number(details.rating) : undefined,
                  priceLevel: priceLevelToNumber(details.price_level as any),
                  openingHours: details.opening_hours?.weekday_text || undefined,
                  photos:
                    details.photos?.slice(0, 10).map((p) => p.getUrl({ maxWidth: 800, maxHeight: 600 })) ||
                    undefined,
                  editorialSummary: (details as any).editorial_summary?.overview || undefined,
                  businessStatus: details.business_status as any,
                  isOpen: isCurrentlyOpen,
                };
                setSelectedRestaurant(enhanced);
              } else {
                setSelectedRestaurant(selected);
              }

              // Distance calculation
              const distanceService = new google.maps.DistanceMatrixService();
              distanceService.getDistanceMatrix(
                {
                  origins: [userLocation],
                  destinations: [newCenter],
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, distStatus) => {
                  if (distStatus === google.maps.DistanceMatrixStatus.OK && response) {
                    try {
                      const element = response.rows[0].elements[0];
                      if (element.status === "OK") {
                        const meters = element.distance.value;
                        const miles = (meters / 1609.344).toFixed(2);
                        const durationText = element.duration.text;
                        setDistance(`${miles} miles (${durationText} driving)`);
                      } else {
                        setApiError("Could not calculate distance.");
                        setDistance(null);
                      }
                    } catch {
                      setApiError("Error processing distance information.");
                      setDistance(null);
                    }
                  } else {
                    setApiError("Failed to get distance information.");
                    setDistance(null);
                  }
                  setIsPicking(false);
                }
              );
            });
          } else {
            setSelectedRestaurant(selected);
            setIsPicking(false);
          }
        });
      } catch {
        setApiError("Could not find the exact location of the restaurant.");
        setDistance(null);
        setMapCenter(null);
        setSelectedRestaurant(selected);
        setIsPicking(false);
      }
    } else {
      if (!userLocation) setApiError("User location not available to find nearby restaurant.");
      // Do not set a maps-not-loaded error; button is disabled until ready.
      setSelectedRestaurant(selected);
      setIsPicking(false);
    }
  }, [filtered, userLocation, placesReady]);

  useEffect(() => {
    setGeolocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setGeolocationError(null);
        },
        (error) => {
          let message = "Error: The Geolocation service failed.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Geolocation permission denied. Location features disabled.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "The request to get user location timed out.";
              break;
            default:
              message = "An unknown error occurred while getting location.";
              break;
          }
          setGeolocationError(message);
          setUserLocation(null);
        }
      );
    } else {
      const message = "Error: Your browser doesn't support geolocation.";
      setGeolocationError(message);
      setUserLocation(null);
    }
  }, []);

  const leftDisabled = isPicking || filtered.length === 0;

  return (
    <Container maxWidth="lg">
      {/* Removed ad-blocker warning banner */}
      {/* {showAdBlockerWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          It looks like you might be using an ad blocker. Some map features may not work correctly.
        </Alert>
      )} */}
      {geolocationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {geolocationError}
        </Alert>
      )}
      <Box sx={{ my: 4, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <img src={logo} alt="Logo" style={{ width: "60px", height: "60px", marginRight: "20px" }} />
        <Typography variant="h4" component="h1" sx={{ marginBottom: 0, display: "flex", alignItems: "center", height: "60px" }}>
          Orlando Random Restaurant Picker
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FiltersPanel
              types={types}
              selectedTypes={selectedTypes}
              loading={false}
              onToggleType={handleTypeChange}
              onSelectAll={selectAllTypes}
              onClearAll={deselectAllTypes}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={pickRandom}
              fullWidth
              size="large"
              sx={{ py: 2, fontSize: "1.2rem" }}
              disabled={leftDisabled || !placesReady}
            >
              {isPicking ? <CircularProgress size={24} color="inherit" /> : "Pick a Random Restaurant"}
            </Button>
            {!placesReady && (
              <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 1, textAlign: "center" }}>
                Loading map services...
              </Typography>
            )}
            {filtered.length === 0 && (
              <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 1, textAlign: "center" }}>
                Select at least one type or clear filters to pick.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <RestaurantDetails
              restaurant={selectedRestaurant}
              apiError={apiError}
              distance={distance}
              mapCenter={mapCenter}
              mapId={GOOGLE_MAP_ID}
              onPhotoClick={handlePhotoClick}
            />
          </Grid>
        </Grid>
      </Box>

      <PhotoModal open={photoModalOpen} photoUrl={selectedPhoto} onClose={handleClosePhotoModal} />
    </Container>
  );
}

export default App;
