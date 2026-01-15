import React from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, CircularProgress, Grid } from '@mui/material';
import { AttendanceUser } from '../types/attendanceTypes';

interface Props {
  user: AttendanceUser;
  successMsg: string;
  onSave?: () => void;
  saving: boolean;
}

const AttendanceUserCard: React.FC<Props> = ({ user, successMsg, onSave, saving }) => (
  <Card
    sx={{
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 2px 8px 0 rgba(76, 175, 80, 0.10)', // subtle green shadow
      borderLeft: '4px solid #22bb33', // green border
      background: '#fff',
    }}
  >
    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 700,
        }}>
          {user.fullName?.split(' ').map(n => n[0]).join('')}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>{user.fullName}</Typography>
          <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
            {user.role} &nbsp;|&nbsp; ID: {user.id}
          </Typography>
        </Box>
      </Stack>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ bgcolor: '#f6fafd', borderRadius: 2, p: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, letterSpacing: 1 }}>CLASS</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#222' }}>{user.className || '-'}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ bgcolor: '#f6fafd', borderRadius: 2, p: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, letterSpacing: 1 }}>TIME</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#222' }}>{user.scanTime}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ bgcolor: '#f6fafd', borderRadius: 2, p: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, letterSpacing: 1 }}>DATE</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#222' }}>{user.date}</Typography>
          </Box>
        </Grid>
      </Grid>
      {/* Success Message */}
      <Box
        sx={{
          mt: 2,
          bgcolor: '#22bb33',
          color: '#fff',
          borderRadius: 1,
          px: 2,
          py: 1.2,
          fontWeight: 600,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {successMsg}
      </Box>
      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      
      </Box>
    </CardContent>
  </Card>
);

export default AttendanceUserCard;