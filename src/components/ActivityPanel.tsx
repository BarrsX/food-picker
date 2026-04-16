import React from "react";
import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { SyncStatus } from "../services/restaurantSync";
import type { PickHistoryEntry } from "../types/activity";
import type { Restaurant } from "../types/restaurant";

interface ActivityPanelProps {
  favorites: Restaurant[];
  history: PickHistoryEntry[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  syncStatus: SyncStatus;
}

const syncStatusLabels: Record<SyncStatus, string> = {
  "local-only": "Local Storage",
  "sync-error": "Sync Needs Attention",
  "sync-ready": "Supabase Sync Ready",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
});

function EmptyState({ copy }: { copy: string }) {
  return (
    <Typography color="text.secondary" variant="body2">
      {copy}
    </Typography>
  );
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({
  favorites,
  history,
  onSelectRestaurant,
  syncStatus,
}) => {
  return (
    <Paper
      className="glass-panel"
      elevation={0}
      sx={{
        p: { xs: 3, md: 3.5 },
        pb: { xs: 3.25, md: 3.75 },
        borderRadius: { xs: "32px", md: "40px" },
        overflow: "visible",
      }}
    >
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Box>
          <Typography variant="h5">Saved And Recent</Typography>
          <Typography color="text.secondary" variant="body2">
            Keep tonight's winners close and reopen them without rerolling.
          </Typography>
        </Box>
        <Chip
          color={syncStatus === "sync-error" ? "warning" : "secondary"}
          label={syncStatusLabels[syncStatus]}
          variant={syncStatus === "sync-ready" ? "filled" : "outlined"}
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={3}>
        <Box>
          <Typography sx={{ mb: 1.5 }} variant="h6">
            Saved Spots
          </Typography>
          {favorites.length === 0 ? (
            <EmptyState copy="Save a restaurant from the results panel and it will show up here." />
          ) : (
            <List disablePadding sx={{ display: "grid", gap: 1 }}>
              {favorites.map((restaurant) => (
                <ListItemButton
                  key={restaurant.name}
                  onClick={() => onSelectRestaurant(restaurant)}
                  sx={{
                    alignItems: "flex-start",
                    borderRadius: "24px",
                    border: "1px solid rgba(22, 49, 74, 0.08)",
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    primary={restaurant.name}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      noWrap: true,
                    }}
                    secondary={restaurant.type}
                    secondaryTypographyProps={{
                      color: "text.secondary",
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>

        <Box>
          <Typography sx={{ mb: 1.5 }} variant="h6">
            Recent Picks
          </Typography>
          {history.length === 0 ? (
            <EmptyState copy="Your last few random picks will land here automatically." />
          ) : (
            <List disablePadding sx={{ display: "grid", gap: 1 }}>
              {history.map((entry) => (
                <ListItemButton
                  key={entry.id}
                  onClick={() => onSelectRestaurant(entry.restaurant)}
                  sx={{
                    alignItems: "flex-start",
                    borderRadius: "24px",
                    border: "1px solid rgba(22, 49, 74, 0.08)",
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    primary={entry.restaurant.name}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      noWrap: true,
                    }}
                    secondary={`${entry.restaurant.type} • ${dateFormatter.format(
                      new Date(entry.pickedAt)
                    )}`}
                    secondaryTypographyProps={{
                      color: "text.secondary",
                      sx: { fontVariantNumeric: "tabular-nums" },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default ActivityPanel;
