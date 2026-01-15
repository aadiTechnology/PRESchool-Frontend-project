import React from 'react';
import { Box, Typography, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // backgroundImage: 'url("/images/happy_kids1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top-right corner buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 2,
        }}
      >
        <Button variant="outlined" color="inherit" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Box>

  
      {/* <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          textAlign: 'center',
        }}
      >
       
      </Box> */}
    </Box>
  );
};

export default NotFound;
