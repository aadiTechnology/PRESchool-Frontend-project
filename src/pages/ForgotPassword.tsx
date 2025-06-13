import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/forgotPassword';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleSendOtp = async () => {
    setError('');
    try {
      await forgotPassword(email);
      localStorage.setItem('resetEmail', email);
      navigate('/otp', { state: { email } });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
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