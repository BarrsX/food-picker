import React, { useCallback, useMemo, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import logo from "./logo.png";
import ActivityPanel from "./components/ActivityPanel";
import FiltersPanel from "./components/FiltersPanel";
import PhotoModal from "./components/PhotoModal";
import RestaurantDetails from "./components/RestaurantDetails";
import restaurantsData from "./data/restaurants";
import { useRestaurantActivity } from "./hooks/useRestaurantActivity";
import { useRestaurantFilters } from "./hooks/useRestaurantFilters";
import { useRestaurantPicker } from "./hooks/useRestaurantPicker";
import { useUserLocation } from "./hooks/useUserLocation";

const GOOGLE_MAP_ID = process.env.REACT_APP_GOOGLE_MAP_ID;

interface AppProps {
  mapsEnabled?: boolean;
}

interface AppShellProps {
  mapsEnabled: boolean;
  placesReady: boolean;
}

function MapsEnabledApp() {
  const placesLib = useMapsLibrary("places");

  return <AppShell mapsEnabled placesReady={Boolean(placesLib)} />;
}

function AppShell({ mapsEnabled, placesReady }: AppShellProps) {
  const {
    clearAll,
    filtered,
    searchQuery,
    selectAll,
    selectedTypes,
    setSearchQuery,
    toggleType,
    types,
  } = useRestaurantFilters(restaurantsData);
  const { favorites, history, isFavorite, recordPick, syncStatus, toggleFavorite } =
    useRestaurantActivity();
  const { locationMessage, userLocation } = useUserLocation();
  const {
    distance,
    isPicking,
    mapCenter,
    pickRandom,
    selectedRestaurant,
    showRestaurant,
    statusMessage,
  } = useRestaurantPicker({
    mapsEnabled,
    placesReady,
    userLocation,
  });
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const handlePickRandom = useCallback(async () => {
    const pickedRestaurant = await pickRandom(filtered);
    if (pickedRestaurant) {
      recordPick(pickedRestaurant);
    }
  }, [filtered, pickRandom, recordPick]);

  const handlePhotoClick = useCallback((photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setPhotoModalOpen(true);
  }, []);

  const handleClosePhotoModal = useCallback(() => {
    setPhotoModalOpen(false);
    setSelectedPhoto(null);
  }, []);

  const stats = useMemo(
    () => [
      `${restaurantsData.length} curated spots`,
      `${types.length} cuisine tags`,
      selectedTypes.length > 0
        ? `${selectedTypes.length} active filters`
        : "Open to anything",
    ],
    [selectedTypes.length, types.length]
  );

  return (
    <>
      <Box className="skip-link" component="a" href="#main-content">
        Skip to main content
      </Box>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "1.35fr 0.85fr" },
            mb: 4,
          }}
        >
          <Box
            className="glass-panel"
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: { xs: "36px", md: "48px" },
              border: "1px solid rgba(255,255,255,0.66)",
              boxShadow: "0 24px 70px rgba(23, 50, 74, 0.12)",
            }}
          >
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
              <Button color="secondary" disableRipple size="small" variant="contained">
                Orlando Edition
              </Button>
              <Button
                disableRipple
                size="small"
                variant="outlined"
                color={mapsEnabled ? "secondary" : "primary"}
              >
                {mapsEnabled
                  ? placesReady
                    ? "Live Maps Ready"
                    : "Maps Loading"
                  : "Curated Mode"}
              </Button>
            </Stack>

            <Stack
              alignItems={{ xs: "flex-start", sm: "center" }}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <Box
                alt="Food Picker logo"
                component="img"
                height="88"
                src={logo}
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: "24px",
                  objectFit: "cover",
                  boxShadow: "0 18px 40px rgba(239,108,47,0.22)",
                }}
                width="88"
              />
              <Box>
                <Typography variant="overline">Food Picker</Typography>
                <Typography sx={{ mt: 1 }} variant="h1">
                  Find a great Orlando meal faster.
                </Typography>
              </Box>
            </Stack>

            <Typography
              color="text.secondary"
              sx={{ mt: 2.5, maxWidth: 640 }}
              variant="body1"
            >
              Filter the shortlist, spin a random pick, save the winners, and
              keep your last few choices ready for the next indecisive night.
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1.25} sx={{ mt: 3 }}>
              {stats.map((stat) => (
                <Box
                  key={stat}
                  sx={{
                    px: 1.6,
                    py: 1,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(23, 50, 74, 0.08)",
                    color: "text.secondary",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                  }}
                >
                  {stat}
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            className="glass-panel"
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: { xs: "36px", md: "48px" },
              background:
                "linear-gradient(160deg, rgba(13,103,120,0.14), rgba(255,255,255,0.72))",
              border: "1px solid rgba(255,255,255,0.66)",
            }}
          >
            <Typography variant="overline">How It Works</Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Typography variant="h3">Filter, pick, save, repeat.</Typography>
              <Typography color="text.secondary" variant="body1">
                The UI now keeps search state in the URL, remembers favorites and
                recent picks, and degrades gracefully when maps or location are
                unavailable in preview deployments.
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Optional Supabase sync is ready for favorites and pick history if
                you add the env vars and tables described in the README.
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {locationMessage && <Alert severity="warning">{locationMessage}</Alert>}
          {!mapsEnabled && (
            <Alert severity="info">
              Add <strong>REACT_APP_GOOGLE_MAPS_API_KEY</strong> in your
              deployment to unlock live maps, photos, and directions.
            </Alert>
          )}
        </Stack>

        <Grid
          component="main"
          container
          id="main-content"
          spacing={3}
          sx={{ alignItems: "stretch" }}
        >
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <FiltersPanel
                filteredCount={filtered.length}
                onClearAll={clearAll}
                onSearchChange={setSearchQuery}
                onSelectAll={selectAll}
                onToggleType={toggleType}
                searchQuery={searchQuery}
                selectedTypes={selectedTypes}
                totalCount={restaurantsData.length}
                types={types}
              />

              <Box
                className="glass-panel"
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: { xs: "30px", md: "36px" },
                  border: "1px solid rgba(255,255,255,0.7)",
                }}
              >
                <Button
                  color="primary"
                  disabled={isPicking || filtered.length === 0}
                  fullWidth
                  onClick={handlePickRandom}
                  size="large"
                  sx={{ py: 1.7, fontSize: "1.02rem" }}
                  variant="contained"
                >
                  {isPicking ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Pick Tonight's Spot"
                  )}
                </Button>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1.2, textAlign: "center" }}
                  variant="caption"
                >
                  {filtered.length === 0
                    ? "No restaurants match this search yet. Try clearing filters."
                    : mapsEnabled && !placesReady
                    ? "Maps are still warming up, but curated picks still work immediately."
                    : "Randomize from the filtered shortlist whenever you're ready."}
                </Typography>
              </Box>

              <ActivityPanel
                favorites={favorites}
                history={history}
                onSelectRestaurant={showRestaurant}
                syncStatus={syncStatus}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} lg={8}>
            <RestaurantDetails
              distance={distance}
              isFavorite={
                selectedRestaurant ? isFavorite(selectedRestaurant.name) : false
              }
              mapCenter={mapCenter}
              mapId={GOOGLE_MAP_ID}
              onPhotoClick={handlePhotoClick}
              onToggleFavorite={() => {
                if (selectedRestaurant) {
                  toggleFavorite(selectedRestaurant);
                }
              }}
              restaurant={selectedRestaurant}
              statusMessage={statusMessage}
            />
          </Grid>
        </Grid>

        <PhotoModal
          onClose={handleClosePhotoModal}
          open={photoModalOpen}
          photoUrl={selectedPhoto}
        />
      </Container>
    </>
  );
}

export default function App({ mapsEnabled = true }: AppProps) {
  return mapsEnabled ? (
    <MapsEnabledApp />
  ) : (
    <AppShell mapsEnabled={false} placesReady={false} />
  );
}
