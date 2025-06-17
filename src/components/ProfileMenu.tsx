import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Adjust the path if needed

const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Get user details from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || 'User';
  const userRole =
    user.role === 2 ? 'Teacher' : user.role === 3 ? 'Parent' : '';
  const userClass = user.className || user.class || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Trigger: Profile Avatar */}
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 40, height: 40 }}>
          {userName.charAt(0)}
        </Avatar>
      </IconButton>

      {/* Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 220,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            borderRadius: 2,
            '& .MuiAvatar-root': {
              width: 40,
              height: 40,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box px={2} py={1}>
          <Box display="flex" alignItems="center">
            <Avatar>{userName.charAt(0)}</Avatar>
            <Box ml={1}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                {userName}
              </Typography>
              {/* <Typography variant="caption" color="text.secondary">
                {userClass}
              </Typography> */}
              {(user.role === 2 || user.role === 3) && userClass && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Class: {userClass}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* <Divider /> */}

        {/* Menu Options */}
        {/* <MenuItem>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FeedbackIcon fontSize="small" />
          </ListItemIcon>
          Feedback
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem> */}

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
