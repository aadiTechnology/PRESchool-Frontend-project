import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Box, useTheme, useMediaQuery, Paper, Grid } from '@mui/material';
import { registerUser } from '../services/registerUser';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Roles } from '../constants/roles';

const roleOptions = [
  { value: Roles.SUPER_ADMIN, label: 'Super Admin' },
  { value: Roles.ADMIN, label: 'Admin' },
  { value: Roles.TEACHER, label: 'Teacher' },
  { value: Roles.PARENT, label: 'Parent' },
];

const getValidationSchema = (role: string) => {
  let base = {
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Confirm Password is required'),
    role: yup.string().required('Role is required'),
  };
  if (role === Roles.TEACHER) {
    return yup.object().shape({
      ...base,
      className: yup.string().required('Class is required'),
      qualification: yup.string().required('Qualification is required'),
    });
  }
  if (role === Roles.PARENT) {
    return yup.object().shape({
      ...base,
      childName: yup.string().required('Child Name is required'),
      childAge: yup.string().required('Child Age is required'),
      childClass: yup.string().required('Child Class is required'),
    });
  }
  return yup.object().shape(base);
};

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: Roles.TEACHER,
    className: '', // <-- Add this
    qualification: '',
    childName: '',
    childAge: '',
    childClass: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async () => {
    const schema = getValidationSchema(formData.role);
    try {
      await schema.validate(formData, { abortEarly: false });
      const payload: any = { ...formData };
      if (formData.role !== Roles.TEACHER) {
        delete payload.className;
        delete payload.qualification;
      }
      if (formData.role !== Roles.PARENT) {
        delete payload.childName;
        delete payload.childAge;
        delete payload.childClass;
      }
      await registerUser(payload);
      alert('User registered successfully');
      navigate('/login');
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const fieldErrors: { [key: string]: string } = {};
        err.inner.forEach((e: any) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(err.message || 'Error registering user');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: isSmall ? 2 : 4, width: '200%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant={isSmall ? "h5" : "h4"} gutterBottom align="center">
              Register
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="First Name" name="firstName"
              value={formData.firstName} onChange={handleChange}
              error={!!errors.firstName} helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Last Name" name="lastName"
              value={formData.lastName} onChange={handleChange}
              error={!!errors.lastName} helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Email" name="email" type="email"
              value={formData.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Phone" name="phone"
              value={formData.phone} onChange={handleChange}
              error={!!errors.phone} helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Password" name="password" type="password"
              value={formData.password} onChange={handleChange}
              error={!!errors.password} helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Confirm Password" name="confirmPassword" type="password"
              value={formData.confirmPassword} onChange={handleChange}
              error={!!errors.confirmPassword} helperText={errors.confirmPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select fullWidth label="Role" name="role"
              value={formData.role} onChange={handleChange}
              error={!!errors.role} helperText={errors.role}
            >
              {roleOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Teacher fields */}
          {formData.role === Roles.TEACHER && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  error={!!errors.className}
                  helperText={errors.className}
                  select
                >
                  <MenuItem value="">Select Class</MenuItem>
                  <MenuItem value="Nursery">Nursery</MenuItem>
                  <MenuItem value="LKG">LKG</MenuItem>
                  <MenuItem value="UKG">UKG</MenuItem>
                  {/* Add more classes as needed */}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  error={!!errors.qualification}
                  helperText={errors.qualification}
                />
              </Grid>
            </>
          )}
          {/* Parent fields */}
          {formData.role === Roles.PARENT && (
            <>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth label="Child Name" name="childName"
                  value={formData.childName} onChange={handleChange}
                  error={!!errors.childName} helperText={errors.childName}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth label="Child Age" name="childAge"
                  value={formData.childAge} onChange={handleChange}
                  error={!!errors.childAge} helperText={errors.childAge}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth label="Child Class" name="childClass"
                  value={formData.childClass} onChange={handleChange}
                  error={!!errors.childClass} helperText={errors.childClass}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Register
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}