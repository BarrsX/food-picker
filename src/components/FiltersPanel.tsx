import React from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface FiltersPanelProps {
  filteredCount: number;
  loading?: boolean;
  onClearAll: () => void;
  onSearchChange: (value: string) => void;
  onSelectAll: () => void;
  onToggleType: (type: string) => void;
  searchQuery: string;
  selectedTypes: string[];
  totalCount: number;
  types: string[];
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filteredCount,
  loading = false,
  onClearAll,
  onSearchChange,
  onSelectAll,
  onToggleType,
  searchQuery,
  selectedTypes,
  totalCount,
  types,
}) => {
  return (
    <Paper
      className="glass-panel"
      elevation={0}
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: { xs: "32px", md: "40px" },
        overflow: "visible",
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4">Tune The Shortlist</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
            Search by name or cuisine, then let the app do the hard part.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Search Restaurants"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Try "ramen" or "pizza"'
          type="search"
          value={searchQuery}
        />

        <Stack
          alignItems={{ xs: "flex-start", sm: "center" }}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Typography color="text.secondary" variant="body2">
            Showing {filteredCount} of {totalCount} restaurants
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button disabled={loading} onClick={onSelectAll} size="small" variant="outlined">
              Select All
            </Button>
            <Button disabled={loading} onClick={onClearAll} size="small" variant="text">
              Clear Filters
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            contentVisibility: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: 360,
            overflowY: "auto",
            pr: 0.5,
          }}
        >
        {types.map((type) => (
          <Chip
            key={type}
            color={selectedTypes.includes(type) ? "primary" : "default"}
            disabled={loading}
            label={type}
            clickable
            onClick={() => onToggleType(type)}
            sx={{
              minHeight: 36,
              touchAction: "manipulation",
            }}
            variant={selectedTypes.includes(type) ? "filled" : "outlined"}
          />
        ))}
        </Box>

        <Typography color="text.secondary" variant="caption">
          Leaving every cuisine unselected means "surprise me with anything."
        </Typography>
      </Stack>
    </Paper>
  );
};

export default FiltersPanel;
