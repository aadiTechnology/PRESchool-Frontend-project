import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import { registerUser } from '../services/registerUser';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '0',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        preschool_id: 0,
      });
      alert("User registered successfully");
      navigate('/login');
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Error registering user");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <TextField
        fullWidth margin="normal" label="First Name" name="first_name"
        value={formData.first_name} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Last Name" name="last_name"
        value={formData.last_name} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Email" name="email" type="email"
        value={formData.email} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Phone" name="phone"
        value={formData.phone} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Password" name="password" type="password"
        value={formData.password} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Confirm Password" name="confirmPassword" type="password"
        value={formData.confirmPassword} onChange={handleChange}
      />
      <TextField
        select fullWidth margin="normal" label="Role" name="role"
        value={formData.role} onChange={handleChange}
      >
        <MenuItem value="0">Super Admin</MenuItem>
        
        
        {/* Add more roles as needed */}
      </TextField>
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Register
      </Button>
    </Container>
  );
}