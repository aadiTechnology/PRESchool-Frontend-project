import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Box, useTheme, useMediaQuery, Paper, Grid } from '@mui/material';
import { registerUser } from '../services/registerUser';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const PRESCHOOL_ID = 1; // School ID 1
const PARENT_ROLE = 3;

const getValidationSchema = () => yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Confirm Password is required'),
  classId: yup.string().required('Class is required'),
  divisionId: yup.string().required('Division is required'),
  childName: yup.string().required('Child Name is required'),
  childAge: yup.number().required('Child Age is required'),
});

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    classId: '',
    divisionId: '',
    childName: '',
    childAge: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [classOptions, setClassOptions] = useState<{ id: number; name: string }[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ id: number; name: string }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch classes (public API, no token)
  useEffect(() => {
    setLoadingClasses(true);
    fetch(`http://localhost:8000/api/v1/auth/public-classes?preschoolId=${PRESCHOOL_ID}`)
      .then(res => res.json())
      .then(setClassOptions)
      .catch(() => setClassOptions([]))
      .finally(() => setLoadingClasses(false));
  }, []);

  // Fetch divisions when classId changes (public API, no token)
  useEffect(() => {
    if (formData.classId) {
      setLoadingDivisions(true);
      fetch(`http://localhost:8000/api/v1/auth/public-divisions?preschoolId=${PRESCHOOL_ID}&classId=${formData.classId}`)
        .then(res => res.json())
        .then(setDivisionOptions)
        .catch(() => setDivisionOptions([]))
        .finally(() => setLoadingDivisions(false));
    } else {
      setDivisionOptions([]);
    }
  }, [formData.classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async () => {
    const schema = getValidationSchema();
    try {
      await schema.validate(formData, { abortEarly: false });
      const payload = {
        ...formData,
        classId: Number(formData.classId),
        divisionId: Number(formData.divisionId),
        preschoolId: PRESCHOOL_ID,
        role: PARENT_ROLE,
        childAge: Number(formData.childAge),
      };
      await registerUser(payload);
      alert('Parent registered successfully');
      navigate('/login');
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const fieldErrors: { [key: string]: string } = {};
        err.inner.forEach((e: any) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(err.message || 'Error registering parent');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: isSmall ? 2 : 4, width: '140%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant={isSmall ? "h5" : "h4"} gutterBottom align="center">
              Student Registration
            </Typography>
            <img src="/images/smartkidz_logo.png" alt="Smartkidz Logo" style={{ display: 'block', margin: '0 auto', width: '100px' }} />
                      
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Child Name" name="childName"
              value={formData.childName} onChange={handleChange}
              error={!!errors.childName} helperText={errors.childName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Child Age" name="childAge" type="number"
              value={formData.childAge} onChange={handleChange}
              error={!!errors.childAge} helperText={errors.childAge}
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Class"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              error={!!errors.classId}
              helperText={errors.classId}
              disabled={loadingClasses}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classOptions.map(opt => (
                <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Division"
              name="divisionId"
              value={formData.divisionId}
              onChange={handleChange}
              error={!!errors.divisionId}
              helperText={errors.divisionId}
              disabled={loadingDivisions || !formData.classId}
            >
              <MenuItem value="">Select Division</MenuItem>
              {divisionOptions.map(opt => (
                <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          
          
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