import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import RouteGuard from './RouteGuards';
import AdminConfig from '../pages/AdminConfig';
import RegisterPreschoolPage from '../features/SuperAdmin/pages/RegisterPreschoolPage';
import UserManagementPage from '../features/Admin/page/UserManagementPage';

import Dashboard from '../features/dashboard/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import OtpVerification from '../pages/OtpVerification';
import ResetPassword from '../pages/ResetPassword';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        
        
        <Route
          path="/dashboard"
          element={
          <AppLayout>
              <Dashboard />
           </AppLayout>
          }
        />
        <Route
          path="/AdminConfig"
          element={
            <AuthLayout>
             <AdminConfig/>
            </AuthLayout>
          }
        />
      
        
        <Route
          path="/register-preschool"
          element={
            // <RouteGuard >
              <AppLayout>
                <RegisterPreschoolPage />
              </AppLayout>
            // </RouteGuard>
          }
        />
        <Route path="/forgot-password" element={<AppLayout><ForgotPassword /></AppLayout>} />
        <Route path="/otp" element={<AppLayout><OtpVerification /></AppLayout>} />
        <Route path="/reset-password" element={<AppLayout><ResetPassword /></AppLayout>} />
        <Route
          path="/admin/users"
          element={
            <AppLayout>
              <UserManagementPage />
            </AppLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;