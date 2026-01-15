import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { AttendanceStats as StatsType } from '../types/attendanceTypes';

const AttendanceStats: React.FC<{ stats: StatsType | null }> = ({ stats }) => (
  <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
    <Grid item xs={12} md={4}>
      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ fontWeight: 500 }}>
            Total Scan Today
          </Typography>
          <Typography variant="h4" align="center" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {stats?.totalScansToday ?? 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ fontWeight: 500 }}>
            Teachers Present
          </Typography>
          <Typography variant="h4" align="center" sx={{ color: 'success.main', fontWeight: 700 }}>
            {stats?.teachersPresent ?? 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ fontWeight: 500 }}>
            Students Present
          </Typography>
          <Typography variant="h4" align="center" sx={{ color: 'error.main', fontWeight: 700 }}>
            {stats?.studentsPresent ?? 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default AttendanceStats;