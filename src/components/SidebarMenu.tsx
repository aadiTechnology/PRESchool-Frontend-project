import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { Screens } from '../constants/roles';


export default function SidebarMenu() {
  // const permissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
  let userJSON = localStorage.getItem('user');
  let user = userJSON== null ? {role:-1} : JSON.parse(userJSON);
  console.log('SidebarMenu', user);
  return (
    <List>
      {Screens
        .filter(screen => (screen.roles.includes(user.role)))
        .map(Screens => (
          <ListItem button component={Link} to={Screens.path} key={Screens.path}>
            <ListItemText primary={Screens.label} />
          </ListItem>
        ))}
    </List>
  );
}