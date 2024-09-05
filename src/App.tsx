import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Paper, 
  Box,
  Grid
} from '@mui/material';
import { Restaurant, restaurants } from './restaurants';
import { useJsApiLoader } from '@react-google-maps/api';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useLoadScript } from "@react-google-maps/api";

const libraries: ("places")[] = ['places'];

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [showAdBlockerWarning, setShowAdBlockerWarning] = useState(false);

  const types = Array.from(new Set(restaurants.map(r => r.type)));

  const filteredRestaurants = selectedTypes.length === 0
    ? restaurants
    : restaurants.filter(r => selectedTypes.includes(r.type));

  const pickRandom = () => {
    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
    const selected = filteredRestaurants[randomIndex];
    setSelectedRestaurant(selected);

    if (userLocation && isLoaded) {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location: userLocation,
        radius: 50000, // Search within 50km
        keyword: selected.name,
        type: 'restaurant'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
          const closestLocation = results[0].geometry?.location;
          if (closestLocation) {
            setMapCenter({ lat: closestLocation.lat(), lng: closestLocation.lng() });
            
            const distanceService = new google.maps.DistanceMatrixService();
            distanceService.getDistanceMatrix(
              {
                origins: [userLocation],
                destinations: [closestLocation],
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (response, status) => {
                if (status === 'OK' && response) {
                  const distanceInMeters = response.rows[0].elements[0].distance.value;
                  const distanceInMiles = (distanceInMeters / 1609.344).toFixed(2);
                  const durationText = response.rows[0].elements[0].duration.text;
                  setDistance(`${distanceInMiles} miles (${durationText} driving)`);
                } else {
                  setDistance(null);
                }
              }
            );
          }
        } else {
          console.error('Places search was not successful');
          setDistance(null);
        }
      });
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prevTypes =>
      prevTypes.includes(type)
        ? prevTypes.filter(t => t !== type)
        : [...prevTypes, type]
    );
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const selectAllTypes = () => {
    setSelectedTypes(types);
  };

  const deselectAllTypes = () => {
    setSelectedTypes([]);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  useEffect(() => {
    const testAdBlocker = async () => {
      try {
        await fetch('https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true');
      } catch (error) {
        setShowAdBlockerWarning(true);
      }
    };
    testAdBlocker();
  }, []);

  return (
    <Container maxWidth="lg">
      {showAdBlockerWarning && (
        <Box sx={{ backgroundColor: 'warning.main', color: 'warning.contrastText', p: 2, mb: 2 }}>
          <Typography>
            It looks like you might be using an ad blocker. Some features of the map may not work correctly. 
            Consider disabling it for this site for the best experience.
          </Typography>
        </Box>
      )}
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Orlando Random Restaurant Picker
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select Food Types:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="outlined" size="small" onClick={selectAllTypes}>
                  Select All
                </Button>
                <Button variant="outlined" size="small" onClick={deselectAllTypes}>
                  Deselect All
                </Button>
              </Box>
              <FormGroup>
                {types.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
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
            >
              Pick a Random Restaurant
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedRestaurant ? (
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  Selected Restaurant:
                </Typography>
                <Typography variant="h4">
                  {selectedRestaurant.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {selectedRestaurant.type}
                </Typography>
                {distance && (
                  <Typography variant="subtitle1">
                    Distance: {distance}
                  </Typography>
                )}
                {mapCenter && (
                  <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                    <GoogleMap
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      center={mapCenter}
                      zoom={15}
                    >
                      <Marker position={mapCenter} />
                    </GoogleMap>
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                  No restaurant selected yet
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
