import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../../types';
import { useTheme } from '@mui/material/styles';
// // Add xlsx for Excel export
// import * as XLSX from 'xlsx';

const roleLabels: Record<number, string> = {
  1: 'admin',
  2: 'teacher',
  3: 'parent',
};

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  roleFilter: number | '';
}

const getColumns = () => [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'className', label: 'Class' },
  { key: 'divisionName', label: 'Division' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'fatherdName', label: 'father Name' },
  { key: 'childAge', label: 'Child Age' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, roleFilter }) => {
  const theme = useTheme();
  const columns = getColumns();

  

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {columns.map(col => {
                  switch (col.key) {
                    case 'name':
                      return <TableCell key="name">{`${user.firstName} ${user.lastName}`}</TableCell>;
                    case 'email':
                      return <TableCell key="email">{user.email}</TableCell>;
                    case 'role':
                      return <TableCell key="role">{roleLabels[user.role] || user.role}</TableCell>;
                    case 'className':
                      return <TableCell key="className">{user.className || '-'}</TableCell>;
                    case 'divisionName':
                      return <TableCell key="divisionName">{user.divisionName || '-'}</TableCell>;
                    case 'qualification':
                      return <TableCell key="qualification">{user.role === 2 ? user.qualification || '-' : '-'}</TableCell>;
                    case 'fatherName':
                      return <TableCell key="fatherName">{user.role === 3 ? user.fatherName || '-' : '-'}</TableCell>;
                    case 'childAge':
                      return <TableCell key="childAge">{user.role === 3 ? user.childAge || '-' : '-'}</TableCell>;
                    case 'edit':
                      return (
                        <TableCell key="edit">
                          <Tooltip title="Edit User">
                            <IconButton onClick={() => onEdit(user)} color="primary">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      );
                    case 'delete':
                      return (
                        <TableCell key="delete">
                          <Tooltip title="Delete User">
                            <IconButton onClick={() => onDelete(user)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      );
                    default:
                      return null;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserTable;