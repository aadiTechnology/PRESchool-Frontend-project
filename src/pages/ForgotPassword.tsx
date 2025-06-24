import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/forgotPassword';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState<number | null>(null);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleSendOtp = async () => {
    setError('');
    setOtp(null);
    try {
      const response = await forgotPassword(email);
      localStorage.setItem('resetEmail', email);
      setOtp(response.otp); // Save OTP from API response
      navigate('/otp', { state: { email, otp: response.otp } }); // Pass OTP to next page
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Forgot Password?
            </Typography>
            <Typography align="center" gutterBottom>
              We'll send you an OTP to reset your password.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Your email address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSendOtp}
            >
              SEND OTP
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;