import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../services/verifyOtp';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('resetEmail') || '';

  const handleVerifyOtp = async () => {
    setError('');
    try {
      await verifyOtp(email, otp);
      // Store email for reset password step
      localStorage.setItem('resetEmail', email);
      navigate('/reset-password');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              OTP Verification
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default OtpVerification;