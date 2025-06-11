import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterPreschoolForm, { PreschoolRegistrationForm } from '../components/RegisterPreschoolForm';
import { registerPreschool } from '../services/registerPreschoolService';
import { Snackbar, Alert } from '@mui/material';

const initialValues = {
  preschoolName: '',
  city: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  password: '',
};

const RegisterPreschoolPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const navigate = useNavigate();

  const handleSubmit = async (data: PreschoolRegistrationForm) => {
    setLoading(true);
    try {
      await registerPreschool(data);
      setSnackbar({open: true, message: 'Preschool and admin successfully created.', severity: 'success'});
      setTimeout(() => navigate('/register'), 1500);
    } catch (error: any) {
      setSnackbar({open: true, message: error?.response?.data?.message || 'Server error', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RegisterPreschoolForm
        onSubmit={handleSubmit}
        loading={loading}
        initialValues={initialValues} // <-- ensure all fields start empty
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default RegisterPreschoolPage;