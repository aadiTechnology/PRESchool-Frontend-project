import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material';
import { User } from '../../../types';

const roleOptions = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Teacher' },
  { value: 3, label: 'Parent' },
];

// Add password and confirmPassword to the form state type
type UserFormState = Partial<User> & { password?: string; confirmPassword?: string };

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  initialData?: Partial<User>;
  isEdit?: boolean;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, onClose, onSave, initialData = {}, isEdit }) => {
  const [form, setForm] = useState<UserFormState>(initialData as UserFormState);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, role: Number(e.target.value) });
  };

  const handleSubmit = () => {
    onSave(form);
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" name="firstName" value={form.firstName || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" name="lastName" value={form.lastName || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Phone" name="phone" value={form.phone || ''} onChange={handleChange} fullWidth required />
          </Grid>
          {/* Show password fields for both add and edit */}
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </>
          <Grid item xs={12}>
            <TextField
              select
              label="Role"
              name="role"
              value={form.role ?? ''}
              onChange={handleRoleChange}
              fullWidth
              required
            >
              {roleOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {form.role === 2 && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField label="Class" name="className" value={form.className || ''} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Qualification" name="qualification" value={form.qualification || ''} onChange={handleChange} fullWidth required />
              </Grid>
            </>
          )}
          {form.role === 3  && (
            <>
              <Grid item xs={12} sm={4}>
                <TextField label="Child Name" name="childName" value={form.childName || ''} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Child Age" name="childAge" value={form.childAge || ''} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Child Class" name="childClass" value={form.childClass || ''} onChange={handleChange} fullWidth required />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;