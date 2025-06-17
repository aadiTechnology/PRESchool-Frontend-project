import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Tooltip, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginUser';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [userId, setUserId] = useState(''); // <-- renamed from email
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [capsLock, setCapsLock] = useState(false);
  const navigate = useNavigate();
  const { login: setUser } = useAuth();

  const handlePasswordKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const clickLogin = async () => {
    setError('');
    try {
      const response = await loginUser(userId, password); // <-- pass userId
      // setUser(response.user);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsLogin(true);
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    if (isLogin) {
      const role = localStorage.getItem('role');
      if (role === '0') navigate('/dashboard');
      else if (role === '1') navigate('/admin/dashboardAdmin');
      else if (role === '2') navigate('/teacher/dashboardTeacher');
      else if (role === '3') navigate('/parent/dashboardParent');
      else navigate('/dashboard');
    }
  }, [isLogin, navigate]);

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome to
            </Typography>
            <img src="/images/smartkidz_logo.png" alt="Smartkidz Logo" style={{ display: 'block', margin: '0 auto', width: '100px' }} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email or Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Tooltip title={capsLock ? 'Ensure your caps lock is off.' : ''} placement="right">
              <TextField
                label="Enter your password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handlePasswordKeyUp}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={clickLogin}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              align="right"
              sx={{ mt: 1, cursor: 'pointer', color: 'primary.main' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Typography>
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

export default Login;