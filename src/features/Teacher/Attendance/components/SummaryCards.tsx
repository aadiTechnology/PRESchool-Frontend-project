import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

export interface SummaryCardItem {
  label: string;
  value: string | number;
  color?: string;
  bgcolor?: string;
}

interface SummaryCardsProps {
  items: SummaryCardItem[];
  columns?: number; // default 4
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ items, columns = 4 }) => (
  <Grid container spacing={2} mb={2}>
    {items.map((item, idx) => (
      <Grid item xs={12} sm={12 / columns} md={12 / columns} key={item.label}>
        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: item.bgcolor || '#fff' }}>
          <Typography variant="h6" sx={{ color: item.color || 'text.primary' }}>
            {item.value}
          </Typography>
          <Typography variant="body2">{item.label}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default SummaryCards;