import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Container, Grid, Snackbar, Alert, MenuItem, TextField, useTheme } from '@mui/material';
import UserTable from './UserTable';
import UserFormDialog from './UserFormDialog';
import { getUsers, addUser, updateUser, deleteUser } from '../services/userService';
import { User } from '../../../types';

// --- Add these imports for class/division fetching ---
import { fetchClasses, ClassOption } from '../services/classService';
import { fetchDivisions, DivisionOption } from '../services/divisionService';

const roleLabels: Record<number, string> = {
  1: 'admin',
  2: 'teacher',
  3: 'parent',
};

const roleFilterOptions = [
  { value: '', label: 'All Roles' },
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Teacher' },
  { value: 3, label: 'Parent' },
];

const UserManagementPage: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const [roleFilter, setRoleFilter] = useState<number | ''>('');

  // --- Add these states for class/division filter ---
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<DivisionOption[]>([]);
  const [classFilter, setClassFilter] = useState<number | ''>('');
  const [divisionFilter, setDivisionFilter] = useState<number | ''>('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setSnackbar({open: true, message: 'Failed to fetch users', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch classes on mount ---
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const preschoolId = user.preschoolId;
    if (preschoolId) {
      fetchClasses(preschoolId)
        .then(setClassOptions)
        .catch(() => setClassOptions([]));
    }
  }, []);

  // --- Fetch divisions when classFilter changes ---
  useEffect(() => {
    if (classFilter) {
      fetchDivisions(classFilter)
        .then(setDivisionOptions)
        .catch(() => setDivisionOptions([]));
    } else {
      setDivisionOptions([]);
    }
    setDivisionFilter(''); // Reset division filter when class changes
  }, [classFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(user.id);
        setSnackbar({open: true, message: 'User deleted', severity: 'success'});
        fetchUsers();
      } catch {
        setSnackbar({open: true, message: 'Failed to delete user', severity: 'error'});
      }
    }
  };

  const handleSave = async (form: Partial<User> & { password?: string; confirmPassword?: string }) => {
    try {
        // Get user from context or localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const preschoolId = user.preschoolId;
      if (editUser) {
        const payload = { ...form,preschoolId };
        if (!payload.password) delete payload.password;
        if (!payload.confirmPassword) delete payload.confirmPassword;
        await updateUser(editUser.id, payload);
        setSnackbar({open: true, message: 'User updated', severity: 'success'});
      } else {
        if (!form.password || !form.confirmPassword) {
          setSnackbar({open: true, message: 'Password and Confirm Password are required', severity: 'error'});
          return;
        }
        await addUser({ ...form,preschoolId });
        setSnackbar({open: true, message: 'User added', severity: 'success'});
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (e: any) {
      setSnackbar({open: true, message: e.message || 'Failed to save user', severity: 'error'});
    }
  };

  // --- Filter users by role, class, and division ---
  const filteredUsers = users
    .filter(user => (roleFilter ? user.role === roleFilter : true))
    .filter(user => (classFilter ? user.classId === classFilter : true))
    .filter(user => (divisionFilter ? user.divisionId === divisionFilter : true));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              letterSpacing: 1,
              mb: { xs: 2, sm: 0 },
            }}
          >
            User Management
          </Typography>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              boxShadow: 1,
            }}
          >
            Add User
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            select
            label="Filter by Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            size="small"
          >
            {roleFilterOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            select
            label="Filter by Class"
            value={classFilter}
            onChange={e => setClassFilter(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            size="small"
          >
            <MenuItem value="">All Classes</MenuItem>
            {classOptions.map(opt => (
              <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            select
            label="Filter by Division"
            value={divisionFilter}
            onChange={e => setDivisionFilter(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
            size="small"
            disabled={!classFilter}
          >
            <MenuItem value="">All Divisions</MenuItem>
            {divisionOptions.map(opt => (
              <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <UserTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} roleFilter={roleFilter} />
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editUser || {}}
        isEdit={!!editUser}
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagementPage;