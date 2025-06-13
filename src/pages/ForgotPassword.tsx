import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleSendOtp = async () => {
    if (!isMounted.current) return;
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && (data.success || data.otpSent)) {
        navigate('/otp');
      } else if (typeof data.detail === 'string') {
        if (isMounted.current) setError(data.detail);
      } else if (data.detail && typeof data.detail === 'object') {
        if (isMounted.current) setError(JSON.stringify(data.detail));
      } else {
        if (isMounted.current) setError('Email not found. Try again.');
      }
    } catch (err: any) {
      if (isMounted.current) setError(err?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Forgot Password?
      </Typography>
      <Typography align="center" gutterBottom>
        We'll send you an OTP to reset your password.
      </Typography>
      <TextField
        label="Your email address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSendOtp}
      >
        SEND OTP
      </Button>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Typography>
      )}
    </Container>
  );
};

export default ForgotPassword;