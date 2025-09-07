export const Roles = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  TEACHER: 2,
  PARENT: 3,
};

export const Screens = [
  { path: '/dashboard', label: 'Dashboard', roles: [Roles.SUPER_ADMIN] },
  { path: '/register-preschool', label: 'Register Pre-School', roles: [Roles.SUPER_ADMIN] },
  // { path: '/admin/dashboardAdmin', label: 'dashboardAdmin', roles: [Roles.ADMIN] },
  // { path: '/teacher/dashboardTeacher', label: 'dashboardTeacher', roles: [Roles.TEACHER] },
  // { path: '/parent/dashboardParent', label: 'dashboardParent', roles: [Roles.PARENT] },
  { path: '/admin/users', label: 'User Management', roles: [Roles.ADMIN] },
  { path: '/teacher/attendance/summary', label: 'Attendance', roles: [Roles.TEACHER] },
  { path: '/teacher/homework', label: 'Homework', roles: [Roles.TEACHER] },
  { path: '/parent/homework', label: 'Homework', roles: [Roles.PARENT] },
  { path: '/teacher/syllabus', label: 'Syllabus', roles: [Roles.TEACHER] },
  { path: '/parent/syllabus', label: 'Syllabus', roles: [Roles.PARENT] },
  { path: '/teacher/notices', label: 'Notice', roles: [Roles.TEACHER] },
  { path: '/parent/notices', label: 'Notice', roles: [Roles.PARENT] },
  { path: '/parent/attendance', label: 'Attendance', roles: [Roles.PARENT] },
  { path: '/admin/dashboardAdmin', label: 'Attendance', roles: [Roles.ADMIN] },
];
