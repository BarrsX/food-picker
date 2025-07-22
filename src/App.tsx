import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Map, AdvancedMarker, APIProvider } from "@vis.gl/react-google-maps";
import {
  Alert,
  Box,
  Button,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Link,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";

import logo from "./logo.png";

export interface Restaurant {
  name: string;
  type: string;
  lat?: number;
  lng?: number;
  // Google Places details
  placeId?: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  priceLevel?: number;
  openingHours?: string[];
  photos?: string[];
  editorialSummary?: string;
  businessStatus?: string;
  isOpen?: boolean;
}

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
const GOOGLE_MAP_ID = process.env.REACT_APP_GOOGLE_MAP_ID as string;
const libraries: "places"[] = ["places"];

interface RestaurantMapProps {
  mapCenter: google.maps.LatLngLiteral;
}

const RestaurantMap: React.FC<RestaurantMapProps> = React.memo(
  ({ mapCenter }) => {
    const mapRef = useRef<google.maps.Map>();

    useEffect(() => {
      if (mapRef.current) {
        mapRef.current.panTo(mapCenter);
      }
    }, [mapCenter]);

    return (
      <Box sx={{ height: 300, width: "100%", mt: 2 }} className="map-container">
        <Map
          mapId={GOOGLE_MAP_ID}
          zoom={15}
          defaultCenter={mapCenter}
          gestureHandling={"greedy"}
          style={{ width: "100%", height: "100%" }}
          onIdle={(map) => {
            if (!mapRef.current) {
              mapRef.current = map.map;
            }
          }}
        >
          <AdvancedMarker position={mapCenter} />
        </Map>
      </Box>
    );
  },
  (prevProps, nextProps) =>
    prevProps.mapCenter.lat === nextProps.mapCenter.lat &&
    prevProps.mapCenter.lng === nextProps.mapCenter.lng
);

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [showAdBlockerWarning, setShowAdBlockerWarning] = useState(false);
  const placesServiceRef = useRef<google.maps.places.PlacesService>();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Fetch restaurants from JSON
  useEffect(() => {
    // Use process.env.PUBLIC_URL to ensure the correct path
    fetch(`${process.env.PUBLIC_URL}/restaurants.json`)
      .then((response) => {
        if (!response.ok) {
          // Include response status text for better debugging
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: Restaurant[]) => {
        setRestaurants(data);
        setRestaurantsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setRestaurantsError("Failed to load restaurant list.");
        setRestaurantsLoading(false);
      });
  }, []);

  const types = useMemo(
    () => Array.from(new Set(restaurants.map((r) => r.type))).sort(),
    [restaurants]
  );

  const filteredRestaurants = useMemo(
    () =>
      selectedTypes.length === 0
        ? restaurants
        : restaurants.filter((r) => selectedTypes.includes(r.type)),
    [selectedTypes, restaurants]
  );

  const handleTypeChange = useCallback((type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  }, []);

  const selectAllTypes = useCallback(() => {
    setSelectedTypes(types);
  }, [types]);

  const deselectAllTypes = useCallback(() => {
    setSelectedTypes([]);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      placesServiceRef.current = new google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [isLoaded]);

  const pickRandom = useCallback(() => {
    if (filteredRestaurants.length === 0) {
      setApiError("No restaurants match the selected criteria.");
      return;
    }

    setIsPicking(true);
    setApiError(null);
    setDistance(null);
    setMapCenter(null);

    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
    const selected = filteredRestaurants[randomIndex];

    if (userLocation && placesServiceRef.current && isLoaded) {
      const request = {
        query: `${selected.name} near me`,
        location: userLocation,
        radius: 50000,
      };

      placesServiceRef.current.textSearch(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results[0] &&
          results[0].geometry?.location
        ) {
          const place = results[0];
          const closestLocation = place.geometry?.location;
          
          if (!closestLocation) {
            console.error("No location found for place");
            setApiError("Could not find the exact location of the restaurant.");
            setSelectedRestaurant(selected);
            setIsPicking(false);
            return;
          }
          
          setMapCenter({
            lat: closestLocation.lat(),
            lng: closestLocation.lng(),
          });

          // Get detailed place information
          if (place.place_id && placesServiceRef.current) {
            const detailsRequest = {
              placeId: place.place_id,
              fields: [
                'place_id',
                'formatted_address',
                'formatted_phone_number',
                'website',
                'rating',
                'price_level',
                'opening_hours',
                'photos',
                'editorial_summary',
                'business_status'
              ]
            };

            placesServiceRef.current.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
              if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                // Try to get editorial summary from different possible fields
                let editorialSummary = undefined;
                const details = placeDetails as any;
                if (details.editorial_summary?.overview) {
                  editorialSummary = details.editorial_summary.overview;
                } else if (details.editorial_summary) {
                  editorialSummary = details.editorial_summary;
                }
                
                // Get current open status
                let isCurrentlyOpen = undefined;
                if (placeDetails.opening_hours) {
                  // Try the recommended isOpen() method first
                  if (typeof placeDetails.opening_hours.isOpen === 'function') {
                    try {
                      isCurrentlyOpen = placeDetails.opening_hours.isOpen();
                    } catch (e) {
                      // Silent fallback if isOpen() fails
                    }
                  }
                  
                  // If isOpen() returns undefined, use open_now as fallback
                  // Note: open_now is deprecated but more reliable than the isOpen() method
                  if (isCurrentlyOpen === undefined && (placeDetails.opening_hours as any).open_now !== undefined) {
                    isCurrentlyOpen = (placeDetails.opening_hours as any).open_now;
                  }
                }
                
                // Update selected restaurant with place details
                const enhancedRestaurant: Restaurant = {
                  ...selected,
                  placeId: placeDetails.place_id,
                  address: placeDetails.formatted_address,
                  phoneNumber: placeDetails.formatted_phone_number,
                  website: placeDetails.website,
                  rating: placeDetails.rating,
                  priceLevel: placeDetails.price_level,
                  openingHours: placeDetails.opening_hours?.weekday_text,
                  photos: placeDetails.photos?.slice(0, 3).map(photo => 
                    photo.getUrl({ maxWidth: 400, maxHeight: 300 })
                  ),
                  editorialSummary: editorialSummary,
                  businessStatus: details.business_status,
                  isOpen: isCurrentlyOpen
                };
                setSelectedRestaurant(enhancedRestaurant);
              } else {
                // Fallback to basic restaurant info if details fail
                setSelectedRestaurant(selected);
              }
            });
          } else {
            setSelectedRestaurant(selected);
          }

          const distanceService = new google.maps.DistanceMatrixService();
          distanceService.getDistanceMatrix(
            {
              origins: [userLocation],
              destinations: [closestLocation],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, distStatus) => {
              if (distStatus === google.maps.DistanceMatrixStatus.OK && response) {
                try {
                  const element = response.rows[0].elements[0];
                  if (element.status === "OK") {
                    const distanceInMeters = element.distance.value;
                    const distanceInMiles = (distanceInMeters / 1609.344).toFixed(
                      2
                    );
                    const durationText = element.duration.text;
                    setDistance(
                      `${distanceInMiles} miles (${durationText} driving)`
                    );
                  } else {
                    console.error("Distance Matrix element status:", element.status);
                    setApiError("Could not calculate distance.");
                    setDistance(null);
                  }
                } catch (e) {
                  console.error("Error processing distance response:", e);
                  setApiError("Error processing distance information.");
                  setDistance(null);
                }
              } else {
                console.error("Distance Matrix request failed with status:", distStatus);
                setApiError("Failed to get distance information.");
                setDistance(null);
              }
              setIsPicking(false);
            }
          );
        } else {
          console.error("Places search failed with status:", status);
          setApiError("Could not find the exact location of the restaurant.");
          setDistance(null);
          setMapCenter(null);
          setSelectedRestaurant(selected);
          setIsPicking(false);
        }
      });
    } else {
      if (!userLocation) {
        setApiError("User location not available to find nearby restaurant.");
      } else if (!isLoaded) {
        setApiError("Map services not loaded yet.");
      }
      setSelectedRestaurant(selected);
      setIsPicking(false);
    }
  }, [filteredRestaurants, userLocation, isLoaded]);

  useEffect(() => {
    setGeolocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGeolocationError(null);
        },
        (error) => {
          let message = "Error: The Geolocation service failed.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Geolocation permission denied. Location features disabled.";
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
          console.error(message, error);
          setGeolocationError(message);
          setUserLocation(null);
        }
      );
    } else {
      const message = "Error: Your browser doesn't support geolocation.";
      console.error(message);
      setGeolocationError(message);
      setUserLocation(null);
    }
  }, []);

  useEffect(() => {
    const testAdBlocker = async () => {
      try {
        await fetch(
          "https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true"
        );
      } catch (error) {
        setShowAdBlockerWarning(true);
      }
    };
    testAdBlocker();
  }, []);

  if (loadError) {
    return (
      <Container>
        <Alert severity="error">
          Error loading Google Maps scripts. Please check your network
          connection and API key configuration.
        </Alert>
      </Container>
    );
  }

  if (!isLoaded || restaurantsLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  if (restaurantsError) {
    return (
      <Container>
        <Alert severity="error">{restaurantsError}</Alert>
      </Container>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Container maxWidth="lg">
        {showAdBlockerWarning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            It looks like you might be using an ad blocker. Some features of
            the map may not work correctly. Consider disabling it for this site
            for the best experience.
          </Alert>
        )}
        {geolocationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {geolocationError}
          </Alert>
        )}
        <Box
          sx={{
            my: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "60px",
              height: "60px",
              marginRight: "20px",
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
              height: "60px",
            }}
          >
            Orlando Random Restaurant Picker
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select Food Types:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={selectAllTypes}
                    disabled={restaurantsLoading}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={deselectAllTypes}
                    disabled={restaurantsLoading}
                  >
                    Deselect All
                  </Button>
                </Box>
                <FormGroup
                  sx={{ maxHeight: "400px", overflowY: "auto", pr: 1 }}
                >
                  {types.map((type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          disabled={restaurantsLoading}
                        />
                      }
                      label={type}
                    />
                  ))}
                </FormGroup>
              </Paper>
              <Button
                variant="contained"
                color="primary"
                onClick={pickRandom}
                fullWidth
                size="large"
                sx={{ py: 2, fontSize: "1.2rem" }}
                disabled={
                  isPicking ||
                  restaurantsLoading ||
                  filteredRestaurants.length === 0
                }
              >
                {isPicking ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Pick a Random Restaurant"
                )}
              </Button>
              {filteredRestaurants.length === 0 && !restaurantsLoading && (
                <Typography
                  color="text.secondary"
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  Select at least one type or clear filters to pick.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              {selectedRestaurant ? (
                <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h5" gutterBottom color="text.primary">
                    Selected Restaurant:
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {selectedRestaurant.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {selectedRestaurant.type}
                  </Typography>
                  
                  {/* Editorial Summary */}
                  {selectedRestaurant.editorialSummary && (
                    <Box sx={{ mt: 2, mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
                        {selectedRestaurant.editorialSummary}
                      </Typography>
                    </Box>
                  )}

                  {/* Status Chips */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {/* Current Open Status */}
                    {selectedRestaurant.isOpen !== undefined && (
                      <Chip 
                        label={selectedRestaurant.isOpen ? '🟢 Open Now' : '🔴 Closed Now'} 
                        color={selectedRestaurant.isOpen ? 'success' : 'error'} 
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}

                    {/* Business Status */}
                    {selectedRestaurant.businessStatus && selectedRestaurant.businessStatus !== 'OPERATIONAL' && (
                      <Chip 
                        label={selectedRestaurant.businessStatus === 'CLOSED_TEMPORARILY' ? 'Temporarily Closed' : 'Permanently Closed'} 
                        color="warning" 
                        variant="outlined" 
                        size="small"
                      />
                    )}
                  </Box>
                  
                  {/* Restaurant Rating */}
                  {selectedRestaurant.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Rating value={selectedRestaurant.rating} readOnly precision={0.1} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {selectedRestaurant.rating}/5
                      </Typography>
                    </Box>
                  )}

                  {/* Price Level */}
                  {selectedRestaurant.priceLevel && (
                    <Box sx={{ my: 1 }}>
                      <Chip 
                        label={`Price: ${'$'.repeat(selectedRestaurant.priceLevel)}`} 
                        color="primary" 
                        variant="outlined" 
                        size="small"
                      />
                    </Box>
                  )}

                  {/* Address */}
                  {selectedRestaurant.address && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Address:</strong> {selectedRestaurant.address}
                    </Typography>
                  )}

                  {/* Phone Number */}
                  {selectedRestaurant.phoneNumber && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Phone:</strong> {selectedRestaurant.phoneNumber}
                    </Typography>
                  )}

                  {/* Website */}
                  {selectedRestaurant.website && (
                    <Box sx={{ mt: 1 }}>
                      <Link
                        href={selectedRestaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                      >
                        Visit Website
                      </Link>
                    </Box>
                  )}

                  {/* Opening Hours */}
                  {selectedRestaurant.openingHours && selectedRestaurant.openingHours.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Opening Hours:
                      </Typography>
                      {selectedRestaurant.openingHours.map((hours, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          {hours}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {/* Photos */}
                  {selectedRestaurant.photos && selectedRestaurant.photos.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Photos:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {selectedRestaurant.photos.map((photo, index) => (
                          <CardMedia
                            key={index}
                            component="img"
                            sx={{ 
                              width: 120, 
                              height: 80, 
                              borderRadius: 1,
                              objectFit: 'cover'
                            }}
                            image={photo}
                            alt={`${selectedRestaurant.name} photo ${index + 1}`}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {apiError && (
                    <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                      {apiError}
                    </Alert>
                  )}
                  {distance && !apiError && (
                    <Typography variant="subtitle1">
                      Distance: {distance}
                    </Typography>
                  )}
                  {mapCenter && !apiError && (
                    <Link
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Get Directions
                    </Link>
                  )}
                  {mapCenter && !apiError && (
                    <RestaurantMap mapCenter={mapCenter} />
                  )}
                </Paper>
              ) : (
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {isPicking
                      ? "Finding a restaurant..."
                      : "No restaurant selected yet"}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </APIProvider>
  );
}

export default App;
