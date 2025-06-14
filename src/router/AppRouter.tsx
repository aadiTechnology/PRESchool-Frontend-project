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
import DashboardAdmin from '../features/dashboard/DashboardAdmin';
import DashboardTeacher from '../features/dashboard/DashboardTeacher';
import Homework from '../features/Teacher/pages/Homework';
import DashboardParent from '../features/dashboard/DashboardParent';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login"
          element={<AuthLayout><Login /></AuthLayout>}
        />

        <Route path="/register"
          element={<AuthLayout><Register /></AuthLayout>}
        />
        
        <Route path="/dashboard"
          element={<AppLayout><Dashboard /></AppLayout>}
        />
        
        <Route path="/register-preschool"
          element={<AppLayout><RegisterPreschoolPage /></AppLayout>}
        />

        <Route path="/AdminConfig"
          element={<AuthLayout><AdminConfig/></AuthLayout>}
        />

        <Route path="/forgot-password" 
        element={<AppLayout><ForgotPassword /></AppLayout>} 
        />

        <Route path="/otp" 
        element={<AppLayout><OtpVerification /></AppLayout>} 
        />

        <Route path="/reset-password" 
        element={<AppLayout><ResetPassword /></AppLayout>} 
        />
        
        <Route
          path="/admin/dashboardAdmin"
          element={<AppLayout>< DashboardAdmin/></AppLayout>}
        />

        <Route
          path="/admin/users"
          element={<AppLayout><UserManagementPage /></AppLayout>}
        />

        <Route
          path="/teacher/dashboardTeacher"
          element={<AppLayout><DashboardTeacher /></AppLayout>}
        />

        <Route
          path="/teacher/homework"
          element={<AppLayout><Homework /></AppLayout>}
        />

        <Route
          path="/parent/dashboardParent"
          element={<AppLayout><DashboardParent /></AppLayout>}
        />

        <Route
          path="/teacher/homeworkView"
          element={<AppLayout><UserManagementPage /></AppLayout>}
        />

        <Route path="*" 
          element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;