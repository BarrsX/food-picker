import React from 'react';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';

interface FiltersPanelProps {
  types: string[];
  selectedTypes: string[];
  loading?: boolean;
  onToggleType: (type: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  types,
  selectedTypes,
  loading = false,
  onToggleType,
  onSelectAll,
  onClearAll,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Food Types:
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="outlined" size="small" onClick={onSelectAll} disabled={loading}>
          Select All
        </Button>
        <Button variant="outlined" size="small" onClick={onClearAll} disabled={loading}>
          Deselect All
        </Button>
      </Box>
      <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {types.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={selectedTypes.includes(type) ? 'primary' : 'default'}
            variant={selectedTypes.includes(type) ? 'filled' : 'outlined'}
            onClick={() => onToggleType(type)}
            disabled={loading}
            sx={{ transition: 'all 0.2s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default FiltersPanel;
