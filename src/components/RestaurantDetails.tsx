import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import type { PickerStatusMessage } from "../hooks/useRestaurantPicker";
import type { Restaurant } from "../types/restaurant";
import RestaurantMap from "./RestaurantMap";

interface RestaurantDetailsProps {
  distance: string | null;
  isFavorite: boolean;
  mapCenter: google.maps.LatLngLiteral | null;
  mapId?: string;
  onPhotoClick: (url: string) => void;
  onToggleFavorite: () => void;
  restaurant: Restaurant | null;
  statusMessage: PickerStatusMessage | null;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  distance,
  isFavorite,
  mapCenter,
  mapId,
  onPhotoClick,
  onToggleFavorite,
  restaurant,
  statusMessage,
}) => {
  if (!restaurant) {
    return (
      <Paper
        className="glass-panel"
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          minHeight: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: { xs: "32px", md: "40px" },
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 440 }}>
          <Typography variant="overline">Ready When You Are</Typography>
          <Typography sx={{ mt: 1 }} variant="h3">
            Pick a restaurant to reveal the live details.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body1">
            We'll surface the shortlist entry immediately, then layer in maps,
            travel time, photos, and opening hours when those services are
            available.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      className="glass-panel"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: { xs: "32px", md: "40px" },
        overflow: "hidden",
      }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            borderRadius: "28px",
            p: { xs: 2.5, md: 3 },
            background:
              "linear-gradient(135deg, rgba(239,108,47,0.16), rgba(7,118,125,0.12))",
          }}
        >
          <Stack
            alignItems={{ xs: "flex-start", sm: "center" }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline">Tonight's Pick</Typography>
              <Typography sx={{ mt: 1 }} variant="h2">
                {restaurant.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body1">
                {restaurant.type}
              </Typography>
            </Box>

            <Button
              color={isFavorite ? "secondary" : "primary"}
              onClick={onToggleFavorite}
              variant={isFavorite ? "contained" : "outlined"}
            >
              {isFavorite ? "Saved Spot" : "Save Spot"}
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip color="secondary" label={restaurant.type} variant="filled" />
          {distance && <Chip label={distance} variant="outlined" />}
          {restaurant.priceLevel && (
            <Chip
              label={`Price • ${"$".repeat(restaurant.priceLevel)}`}
              variant="outlined"
            />
          )}
          {restaurant.isOpen !== undefined && (
            <Chip
              color={restaurant.isOpen ? "success" : "default"}
              label={restaurant.isOpen ? "Open Now" : "Closed Now"}
              variant={restaurant.isOpen ? "filled" : "outlined"}
            />
          )}
          {restaurant.businessStatus &&
            restaurant.businessStatus !== "OPERATIONAL" && (
              <Chip
                color="warning"
                label={
                  restaurant.businessStatus === "CLOSED_TEMPORARILY"
                    ? "Temporarily Closed"
                    : "Not Operational"
                }
                variant="outlined"
              />
            )}
        </Stack>

      {restaurant.editorialSummary && (
        <Box
          sx={{
            p: 2.5,
            borderRadius: "24px",
            backgroundColor: "rgba(255,255,255,0.72)",
          }}
        >
          <Typography
            color="text.primary"
            sx={{ fontStyle: "italic" }}
            variant="body1"
          >
            {restaurant.editorialSummary}
          </Typography>
        </Box>
      )}

      {restaurant.rating && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Rating value={restaurant.rating} readOnly precision={0.1} />
          <Typography variant="body2">
            {restaurant.rating.toFixed(1)} / 5
          </Typography>
        </Box>
      )}

        {statusMessage && (
          <Alert severity={statusMessage.severity}>{statusMessage.text}</Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <Box>
            <Typography variant="h5">Visit</Typography>
            <Stack spacing={1.1} sx={{ mt: 1.5 }}>
              {restaurant.address && (
                <Typography color="text.secondary" variant="body2">
                  <strong>Address:</strong> {restaurant.address}
                </Typography>
              )}
              {restaurant.phoneNumber && (
                <Typography color="text.secondary" variant="body2">
                  <strong>Phone:</strong>{" "}
                  <Link href={`tel:${restaurant.phoneNumber.replace(/\D/g, "")}`}>
                    {restaurant.phoneNumber}
                  </Link>
                </Typography>
              )}
              {restaurant.website && (
                <Typography color="text.secondary" variant="body2">
                  <strong>Website:</strong>{" "}
                  <Link
                    href={restaurant.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Visit Website
                  </Link>
                </Typography>
              )}
              {mapCenter && (
                <Typography color="text.secondary" variant="body2">
                  <strong>Directions:</strong>{" "}
                  <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open in Google Maps
                  </Link>
                </Typography>
              )}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5">Hours</Typography>
            {restaurant.openingHours && restaurant.openingHours.length > 0 ? (
              <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                {restaurant.openingHours.map((hours) => (
                  <Typography
                    color="text.secondary"
                    key={hours}
                    variant="body2"
                  >
                    {hours}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                Live opening hours are not available for this restaurant yet.
              </Typography>
            )}
          </Box>
        </Box>

      {restaurant.openingHours && restaurant.openingHours.length > 0 && (
        <Divider />
      )}

      {restaurant.photos && restaurant.photos.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom variant="h5">
            Photo Preview
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1.25,
              mb: 2,
            }}
          >
            {restaurant.photos.map((photo) => (
              <Box
                key={photo}
                alt={`${restaurant.name} photo`}
                component="img"
                height="128"
                loading="lazy"
                onClick={() => onPhotoClick(photo)}
                src={photo}
                sx={{
                  width: "100%",
                  height: 128,
                  borderRadius: "20px",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 18px 40px rgba(22, 49, 74, 0.16)",
                  },
                }}
                width="176"
              />
            ))}
          </Box>
        </Box>
      )}

        {mapCenter && (
          <>
            <Divider />
            <Box>
              <Typography gutterBottom variant="h5">
                Map
              </Typography>
              <RestaurantMap center={mapCenter} mapId={mapId} />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default RestaurantDetails;
