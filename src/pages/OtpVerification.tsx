import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    setError('');
    // Call backend to verify OTP
    const response = await fetch('http://localhost:8000/api/v1/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    if (response.ok) {
      navigate('/reset-password');
    } else {
      setError('Invalid OTP. Please try again.');
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