import React from 'react';
import { Box, CssBaseline, Grid, Container } from '@mui/material';
import Header from '../components/ProfileMenu';
import Footer from '../components/Footer';
import Header1 from '../components/Header1';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#fafbfc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box>
          <Header1 />
        </Box>

        {/* Main content area with responsive Container and Grid */}
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 2 }}>
          <Grid
            container
            justifyContent="center"
            alignItems="flex-start"
            overflow={'auto'}
            sx={{ minHeight: '60vh' }}
          >
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box sx={{ flexShrink: 0, mt: 'auto', bgcolor: '#f5f5f5' }}>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
