import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/resetPassword';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail') || '';

  const handleReset = async () => {
    setError('');
    if (!password || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await resetPassword(email, password);
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Reset Your Password
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="New password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm new password"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleReset}
            >
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ResetPassword;