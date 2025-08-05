import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { Screens } from '../constants/roles';

interface SidebarMenuProps {
  onMenuClick: () => void; // Add this prop
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuClick }) => {
  const userJSON = localStorage.getItem('user');
  const user = userJSON == null ? { role: -1 } : JSON.parse(userJSON);

  return (
    <List>
      {Screens.filter(screen => screen.roles.includes(user.role)).map(screen => (
        <ListItem
          button
          component={Link}
          to={screen.path}
          key={screen.path}
          onClick={onMenuClick} // Call the onMenuClick prop when a menu item is clicked
        >
          <ListItemText primary={screen.label} />
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarMenu;