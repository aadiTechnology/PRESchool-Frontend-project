import React from 'react';
import { Box, Button, Grid, TextField, Typography, Container, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

export interface PreschoolRegistrationForm {
  preschoolName: string;
  city: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  password: string;
  confirmPassword: string; // <-- Add this line
}

const schema = yup.object().shape({
  preschoolName: yup.string().required('Preschool Name is required'),
  city: yup.string().required('City/Location is required'),
  adminFirstName: yup.string().required('Admin First Name is required'),
  adminLastName: yup.string().required('Admin Last Name is required'),
  adminEmail: yup.string().email('Invalid email').required('Admin Email is required'),
  adminPhone: yup.string().matches(/^[0-9]{10}$/, 'Invalid phone').required('Admin Phone is required'),
  password: yup.string().required('Initial Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required'), // <-- Add this validation
});

interface Props {
  onSubmit: (data: PreschoolRegistrationForm) => void;
  loading?: boolean;
  initialValues?: Partial<PreschoolRegistrationForm>;
}

const RegisterPreschoolForm: React.FC<Props> = ({ onSubmit, loading, initialValues }) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm<PreschoolRegistrationForm>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  const navigate = useNavigate();

  const onSubmitHandler = async (formData: PreschoolRegistrationForm) => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await onSubmit({
        preschoolName: formData.preschoolName,
        city: formData.city,
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
        password: formData.password,
        confirmPassword: formData.password,
      });
      alert("Preschool registered successfully");
      reset(); // <-- Reset the form here
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Error registering preschool");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 2 }}>
          <Typography variant="h5" mb={2} align="center">Register a New Preschool</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="preschoolName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Preschool Name" fullWidth error={!!errors.preschoolName} helperText={errors.preschoolName?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="City/Location" fullWidth error={!!errors.city} helperText={errors.city?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="adminFirstName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Admin First Name" fullWidth error={!!errors.adminFirstName} helperText={errors.adminFirstName?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="adminLastName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Admin Last Name" fullWidth error={!!errors.adminLastName} helperText={errors.adminLastName?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="adminEmail"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Admin Email" fullWidth error={!!errors.adminEmail} helperText={errors.adminEmail?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="adminPhone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Admin Phone" fullWidth error={!!errors.adminPhone} helperText={errors.adminPhone?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Initial Password (optional)" type="password" fullWidth error={!!errors.password} helperText={errors.password?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                Add Preschool
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPreschoolForm;