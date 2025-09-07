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
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

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
    const { name, value } = e.target;

    // Restrict input to alphabets for specific fields
    if (['firstName', 'lastName', 'qualification'].includes(name)) {
      const alphabetRegex = /^[a-zA-Z\s]*$/; // Allow alphabets and spaces
      if (!alphabetRegex.test(value)) {
        return; // Ignore invalid input
      }
    }

    // Restrict input to numbers for specific fields
    if (['age', 'phone'].includes(name)) {
      const numberRegex = /^[0-9]*$/; // Allow only numbers
      if (!numberRegex.test(value)) {
        return; // Ignore invalid input
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, role: Number(e.target.value), classId: undefined, divisionId: undefined });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errors = { ...validationErrors };

    // First Name
    if (name === 'firstName') {
      if (value.trim() === '') {
        errors.firstName = 'First Name is required';
      } else {
          delete errors.firstName;
      }
    }

    // Last Name
    if (name === 'lastName') {
      if (value.trim() === '') {
        errors.lastName = 'Last Name is required';
      } else {
        delete errors.lastName;
      }
    }

    // Qualification
    if (name === 'qualification') {
      if (value.trim() === '') {
        errors.qualification = 'Qualification is required';
      } else {
        const qualificationRegex = /^[a-zA-Z\s]+$/; // Regex for alphabets and spaces
        if (!qualificationRegex.test(value)) {
          errors.qualification = 'Qualification must contain only alphabets';
        } else {
          delete errors.qualification;
        }
      }
    }

    // Email
    if (name === 'email') {
      if (value.trim() === '') {
        errors.email = 'Email is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
        if (!emailRegex.test(value)) {
          errors.email = 'Invalid email address';
        } else {
          delete errors.email;
        }
      }
    }

    // Phone
    if (name === 'phone') {
      if (value.trim() === '') {
        errors.phone = 'Phone is required';
      } else {
        const phoneRegex = /^[0-9]{10}$/; // Regex for 10-digit phone number
        if (!phoneRegex.test(value)) {
          errors.phone = 'Invalid phone number';
        } else {
          delete errors.phone;
        }
      }
    }

    // Password
    if (name === 'password' && value.trim() === '') {
      errors.password = 'Password is required';
    } else if (name === 'password') {
      delete errors.password;
    }

    // Confirm Password
    if (name === 'confirmPassword' && value.trim() === '') {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (name === 'confirmPassword' && value !== form.password) {
      errors.confirmPassword = 'Passwords do not match';
    } else if (name === 'confirmPassword') {
      delete errors.confirmPassword;
    }

    setValidationErrors(errors);
  };

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {};

    if (!form.firstName) errors.firstName = 'First Name is required';
    if (!form.lastName) errors.lastName = 'Last Name is required';
    if (!form.email) errors.email = 'Email is required';
    if (!form.phone) errors.phone = 'Phone is required';
    if (!form.password) errors.password = 'Password is required';
    if (!form.confirmPassword) errors.confirmPassword = 'Confirm Password is required';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!form.role) errors.role = 'Role is required';

    if (form.role === 2 || form.role === 3) {
      if (!form.classId) errors.classId = 'Class is required';
      if (!form.divisionId) errors.divisionId = 'Division is required';
    }

    if (form.role === 3) {
      if (!form.fatherName) errors.fatherName = 'Child Name is required';
      if (!form.childAge) errors.childAge = 'Child Age is required';
    }

    if (form.role === 2) {
      if (!form.qualification) errors.qualification = 'Qualification is required';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSave(form);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              required
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              type="password"
              value={form.lastName || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              required
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth required 
            onBlur={handleBlur} error={!!validationErrors.email} helperText={validationErrors.email}/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Phone" name="phone" value={form.phone || ''} onChange={handleChange} fullWidth required 
            onBlur={handleBlur} error={!!validationErrors.phone} helperText={validationErrors.phone}/>
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
                onBlur={handleBlur}
                fullWidth
                required
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword || ''} onChange={handleChange} fullWidth required 
              onBlur={handleBlur} error={!!validationErrors.confirmPassword} helperText={validationErrors.confirmPassword}/>
            </Grid>
          </>
          <Grid item xs={12}>
            <TextField select label="Role" name="role" value={form.role ?? ''} onChange={handleRoleChange} fullWidth required 
            onBlur={handleBlur} error={!!validationErrors.role} helperText={validationErrors.role}>
              {roleOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {(form.role === 2 || form.role === 3) && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField select label="Class" name="classId" value={form.classId ?? ''} onChange={handleSelectChange} fullWidth required disabled={loadingClasses} 
                onBlur={handleBlur} error={!!validationErrors.classId} helperText={validationErrors.classId}>
                  <MenuItem value="">Select Class</MenuItem>
                  {classOptions.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Division" name="divisionId" value={form.divisionId ?? ''} onChange={handleSelectChange} fullWidth required disabled={loadingDivisions || !form.classId} 
                onBlur={handleBlur} error={!!validationErrors.divisionId} helperText={validationErrors.divisionId}>
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
                <TextField label="father Name" name="fatherName" value={form.fatherName || ''} onChange={handleChange} fullWidth required 
                onBlur={handleBlur} error={!!validationErrors.fatherName} helperText={validationErrors.fatherName}/>
                
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Child Age" name="childAge" value={form.childAge || ''} onChange={handleChange} fullWidth required 
                onBlur={handleBlur} error={!!validationErrors.childAge} helperText={validationErrors.childAge}/>
              </Grid>
            </>
          )}
          {form.role === 2 && (
            <Grid item xs={12}> 
              <TextField label="Qualification" name="qualification" value={form.qualification || ''} onChange={handleChange} fullWidth required 
                onBlur={handleBlur} error={!!validationErrors.qualification} helperText={validationErrors.qualification}/>              
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