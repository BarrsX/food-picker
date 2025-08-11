import React from 'react';
import { Alert, Box, CardMedia, Chip, Divider, Link, Paper, Rating, Typography } from '@mui/material';
import RestaurantMap from './RestaurantMap';
import { Restaurant } from '../types/restaurant';

interface RestaurantDetailsProps {
  restaurant: Restaurant | null;
  apiError: string | null;
  distance: string | null;
  mapCenter: google.maps.LatLngLiteral | null;
  mapId: string;
  onPhotoClick: (url: string) => void;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurant,
  apiError,
  distance,
  mapCenter,
  mapId,
  onPhotoClick,
}) => {
  if (!restaurant) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <Typography variant="h5" color="text.secondary">No restaurant selected yet</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom color="text.primary">
        Selected Restaurant:
      </Typography>
      <Typography variant="h4" color="primary.main">{restaurant.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {restaurant.type}
      </Typography>

      {restaurant.editorialSummary && (
        <Box sx={{ mt: 2, mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
            {restaurant.editorialSummary}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {restaurant.isOpen !== undefined && (
          <Chip label={restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed Now'} color={restaurant.isOpen ? 'success' : 'error'} variant="filled" size="small" sx={{ fontWeight: 'bold' }} />
        )}
        {restaurant.businessStatus && restaurant.businessStatus !== 'OPERATIONAL' && (
          <Chip label={restaurant.businessStatus === 'CLOSED_TEMPORARILY' ? 'Temporarily Closed' : 'Permanently Closed'} color="warning" variant="outlined" size="small" />
        )}
      </Box>

      {restaurant.rating && (
        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
          <Rating value={restaurant.rating} readOnly precision={0.1} />
          <Typography variant="body2" sx={{ ml: 1 }}>{restaurant.rating.toFixed(1)}/5</Typography>
        </Box>
      )}

      {restaurant.priceLevel && (
        <Box sx={{ my: 1 }}>
          <Chip label={`Price: ${'$'.repeat(restaurant.priceLevel)}`} color="primary" variant="outlined" size="small" />
        </Box>
      )}

      {restaurant.address && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Address:</strong> {restaurant.address}
        </Typography>
      )}
      {restaurant.phoneNumber && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Phone:</strong> {restaurant.phoneNumber}
        </Typography>
      )}
      {restaurant.website && (
        <Box sx={{ mt: 1 }}>
          <Link href={restaurant.website} target="_blank" rel="noopener noreferrer" variant="body2">Visit Website</Link>
        </Box>
      )}

      {restaurant.openingHours && restaurant.openingHours.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Opening Hours:</Typography>
          {restaurant.openingHours.map((hours, index) => (
            <Typography key={index} variant="body2" color="text.secondary">{hours}</Typography>
          ))}
        </Box>
      )}

      {restaurant.photos && restaurant.photos.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Photos:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {restaurant.photos.map((photo) => (
              <CardMedia
                key={photo}
                component="img"
                sx={{ width: 120, height: 80, borderRadius: 1, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}
                image={photo}
                alt={`${restaurant.name} photo`}
                onClick={() => onPhotoClick(photo)}
              />
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {apiError && (<Alert severity="error" sx={{ mt: 1, mb: 1 }}>{apiError}</Alert>)}
      {distance && !apiError && (<Typography variant="subtitle1">Distance: {distance}</Typography>)}
      {mapCenter && !apiError && (
        <Link href={`https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', mt: 1 }}>
          Get Directions
        </Link>
      )}
      {mapCenter && !apiError && (<RestaurantMap mapId={mapId} center={mapCenter} />)}
    </Paper>
  );
};

export default RestaurantDetails;
