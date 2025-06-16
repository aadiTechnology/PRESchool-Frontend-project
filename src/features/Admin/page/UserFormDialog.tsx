import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material';
import { User } from '../../../types';
import { fetchClasses, ClassOption } from '../services/classService';
import { fetchDivisions, DivisionOption } from '../services/divisionService';

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
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<DivisionOption[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  // Fetch classes for Teacher or Parent
  useEffect(() => {
    if (open && (form.role === 2 || form.role === 3)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const preschoolId = user.preschoolId;
      if (preschoolId) {
        setLoadingClasses(true);
        fetchClasses(preschoolId)
          .then(setClassOptions)
          .catch(() => setClassOptions([]))
          .finally(() => setLoadingClasses(false));
      }
    }
  }, [open, form.role]);

  // Fetch divisions when classId changes for Teacher or Parent
  useEffect(() => {
    if (open && (form.role === 2 || form.role === 3) && form.classId) {
      setLoadingDivisions(true);
      fetchDivisions(form.classId)
        .then(setDivisionOptions)
        .catch(() => setDivisionOptions([]))
        .finally(() => setLoadingDivisions(false));
    } else {
      setDivisionOptions([]);
    }
  }, [open, form.role, form.classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, role: Number(e.target.value), classId: undefined, divisionId: undefined });
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
              <TextField label="Password" name="password" type="password" value={form.password || ''} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword || ''} onChange={handleChange} fullWidth required />
            </Grid>
          </>
          <Grid item xs={12}>
            <TextField select label="Role" name="role" value={form.role ?? ''} onChange={handleRoleChange} fullWidth required >
              {roleOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {(form.role === 2 || form.role === 3) && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField select label="Class" name="classId" value={form.classId ?? ''} onChange={handleSelectChange} fullWidth required disabled={loadingClasses} >
                  <MenuItem value="">Select Class</MenuItem>
                  {classOptions.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Division" name="divisionId" value={form.divisionId ?? ''} onChange={handleSelectChange} fullWidth required disabled={loadingDivisions || !form.classId} >
                  <MenuItem value="">Select Division</MenuItem>
                  {divisionOptions.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          )}
          {form.role === 3 && (
            <>
              <Grid item xs={12} sm={4}>
                <TextField label="Child Name" name="childName" value={form.childName || ''} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Child Age" name="childAge" value={form.childAge || ''} onChange={handleChange} fullWidth required />
              </Grid>
            </>
          )}
          {form.role === 2 && (
            <Grid item xs={12}> 
              <TextField label="Qualification" name="qualification" value={form.qualification || ''} onChange={handleChange} fullWidth required />
            </Grid>
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