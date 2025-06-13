import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
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
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        OTP Verification
      </Typography>
      <TextField
        label="Enter OTP"
        variant="outlined"
        fullWidth
        margin="normal"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleVerifyOtp}
      >
        Verify OTP
      </Button>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default OtpVerification;