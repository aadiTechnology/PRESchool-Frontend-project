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
import DashboardParent from '../features/dashboard/DashboardParent';
import AssignHomeworkPage from '../features/Teacher/Homework/pages/AssignHomeworkPage';
import HomeworkListPage from '../features/Teacher/Homework/pages/HomeworkListPage';
import HomeworkViewPage from '../features/Teacher/Homework/pages/HomeworkViewPage';
import SyllabusPage from '../features/Teacher/Syllabus/pages/SyllabusPage';
import NoticeListPage from '../features/Teacher/Notice/pages/NoticeListPage';
import NoticeViewPage from '../features/Teacher/Notice/pages/NoticeViewPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={<AuthLayout><Login /></AuthLayout>}
        />
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
          path="/parent/dashboardParent"
          element={<AppLayout><DashboardParent /></AppLayout>}
        />

        <Route
          path="/teacher/homeworkView"
          element={<AppLayout><UserManagementPage /></AppLayout>}
        />

        <Route
          path="/teacher/assign-homework"
          element={<AppLayout><AssignHomeworkPage /></AppLayout>}
        />

        <Route
          path="/teacher/homework"
          element={<AppLayout><HomeworkListPage /></AppLayout>}
        />

        <Route
          path="/parent/homework"
          element={<AppLayout><HomeworkListPage /></AppLayout>} // or a parent-specific page if needed
        />

        <Route
          path="/teacher/homework/:id"
          element={<AppLayout><HomeworkViewPage /></AppLayout>}
        />

        <Route
          path="/teacher/syllabus"
          element={<AppLayout><SyllabusPage /></AppLayout>}
        />
        <Route
          path="/parent/syllabus"
          element={<AppLayout><SyllabusPage /></AppLayout>}
        />

        <Route
          path="/teacher/notices"
          element={<AppLayout><NoticeListPage /></AppLayout>}
        />
        <Route
          path="/parent/notices"
          element={<AppLayout><NoticeListPage /></AppLayout>}
        />
        <Route
          path="/teacher/notices/:id"
          element={<AppLayout><NoticeViewPage /></AppLayout>}
        />
        <Route
          path="/parent/notices/:id"
          element={<AppLayout><NoticeViewPage /></AppLayout>}
        />

        <Route path="*" 
          element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;