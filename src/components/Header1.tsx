import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarMenu from './SidebarMenu';
import ProfileMenu from './ProfileMenu';

const schoolName = 'Smartkidz Wakad';
const logoUrl = '/images/smartkidz_logo.png';

const Header1: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          boxShadow: 1,
          height: 64,
          justifyContent: 'center',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: isMobile ? 1 : 2,
            height: '100%',
          }}
        >
          {/* LEFT: Drawer Icon + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open sidebar"
              onClick={handleDrawerOpen}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 100,
              backgroundColor: '#ffffff', // White background for the logo
              borderRadius: 1, // Optional: Add rounded corners
              padding: 0.5, // Optional: Add some padding around the logo
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle shadow
            }}
          >
            <img
              src={logoUrl}
              alt="School Logo"
              style={{
                height: isMobile ? 30 : 40,
                maxWidth: '100%',
              }}
            /></Box>
          </Box>

          {/* CENTER: School Name */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
              pointerEvents: 'none',
              px: 1,
            }}
          >
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              fontWeight={600}
              noWrap
            >
              {schoolName}
            </Typography>
          </Box>

          {/* RIGHT: Profile Menu */}
          <Box sx={{ minWidth: 48 }}>
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 220,
            bgcolor: '#f5f5f5',
            borderRight: '1px solid #ddd',
          },
        }}
      >
        <SidebarMenu onMenuClick={handleDrawerClose} /> {/* Pass the handler */}
      </Drawer>
    </>
  );
};

export default Header1;
