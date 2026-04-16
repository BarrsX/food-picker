import React from "react";
import { Box } from "@mui/material";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";

interface RestaurantMapProps {
  center: google.maps.LatLngLiteral;
  mapId?: string;
}

const RestaurantMap: React.FC<RestaurantMapProps> = React.memo(
  ({ center, mapId }) => {
    return (
      <Box
        sx={{
          height: { xs: 280, md: 340 },
          width: "100%",
          mt: 1.5,
          overflow: "hidden",
          borderRadius: "24px",
        }}
      >
      <Map
        center={center}
        defaultZoom={15}
        gestureHandling="greedy"
        mapId={mapId}
        reuseMaps
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <AdvancedMarker position={center} />
      </Map>
      </Box>
    );
  }
);

export default RestaurantMap;
