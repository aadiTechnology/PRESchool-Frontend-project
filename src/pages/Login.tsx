import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Tooltip } from '@mui/material';
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
      // setUser(email, password); // REMOVE THIS LINE
      // If you want to update context:
      // setUser(response.user);
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    if (isLogin) {
      const role = localStorage.getItem('role');
      if (role === '0') navigate('/dashboard');
      else if (role === '1') navigate('/admin-dashboard');
      else if (role === '2') navigate('/teacher-dashboard');
      else if (role === '3') navigate('/parent-dashboard');
      else navigate('/dashboard');
    }
  }, [isLogin, navigate]);

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Welcome to Preschool ERP
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Log in to manage schools and users.
      </Typography>
      <form>
        <TextField
          label="Enter your registered email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
          />
        </Tooltip>
        <Button
          onClick={clickLogin}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          align="right"
          sx={{ mt: 1, cursor: 'pointer', color: 'primary.main' }}
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Container>
  );
};

export default Login;