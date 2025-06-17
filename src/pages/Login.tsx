import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Tooltip, Grid, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginUser';
import useAuth from '../hooks/useAuth';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [capsLock, setCapsLock] = useState(false);
  const navigate = useNavigate();
  const { login: setUser } = useAuth();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Responsive logo size
  let logoSize = 120;
  if (isXs) logoSize = 80;
  else if (isSm) logoSize = 100;

  const handlePasswordKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const clickLogin = async () => {
    setError('');
    try {
      const response = await loginUser(email, password);
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
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: { xs: '#f5f5f5', md: '#fff' },
        px: { xs: 0, sm: 2 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
          borderRadius: { xs: 0, sm: 2 },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant={isXs ? 'h5' : 'h4'}
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.2rem' },
              }}
            >
              Welcome to 
            </Typography>
            <img
              src="/images/SMARTKIDZ_LOGO.png"
              alt="Smartkidz Logo"
              style={{
                display: 'block',
                margin: '16px auto',
                maxWidth: logoSize,
                maxHeight: logoSize,
                width: '100%',
                height: 'auto',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size={isXs ? 'small' : 'medium'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
              sx={{ mb: 1 }}
              InputLabelProps={{ shrink: true }} // <-- This keeps the label at the top
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              size={isXs ? 'small' : 'medium'}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="off"
              sx={{ mb: 1 }}
              InputLabelProps={{ shrink: true }} // <-- This keeps the label at the top
              onKeyUp={e => setCapsLock(e.getModifierState && e.getModifierState('CapsLock'))}
            />
            {capsLock && (
              <Typography color="warning.main" variant="caption">
                Warning: Caps Lock is ON
              </Typography>
            )}
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size={isXs ? 'small' : 'medium'}
              disabled={isLogin}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                mt: 1,
              }}
              onClick={async () => {
                setIsLogin(true);
                setError('');
                try {
                  const user = await loginUser(email, password);
                  setUser(user, password);
                  navigate('/');
                } catch (err: any) {
                  setError(err?.message || 'Login failed');
                } finally {
                  setIsLogin(false);
                }
              }}
            >
              {isLogin ? 'Logging in...' : 'Login'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;