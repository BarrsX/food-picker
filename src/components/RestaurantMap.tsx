import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface RestaurantMapProps {
  mapId: string;
  center: google.maps.LatLngLiteral;
}

const RestaurantMap: React.FC<RestaurantMapProps> = React.memo(({ mapId, center }) => {
  const mapRef = useRef<google.maps.Map>();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  return (
    <Box sx={{ height: 300, width: '100%', mt: 2 }}>
      <Map
        mapId={mapId}
        zoom={15}
        defaultCenter={center}
        gestureHandling={'greedy'}
        style={{ width: '100%', height: '100%' }}
        onIdle={(map) => {
          if (!mapRef.current) {
            mapRef.current = map.map;
          }
        }}
      >
        <AdvancedMarker position={center} />
      </Map>
    </Box>
  );
});

export default RestaurantMap;
