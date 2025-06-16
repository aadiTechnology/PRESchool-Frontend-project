export const Roles = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  TEACHER: 2,
  PARENT: 3,
};

export const Screens = [
  { path: '/dashboard', label: 'Dashboard',roles: [Roles.SUPER_ADMIN] },
  { path: '/register-preschool', label: 'Register Pre-School',roles: [Roles.SUPER_ADMIN] },
  { path: '/admin/dashboardAdmin', label: 'dashboardAdmin',roles: [Roles.ADMIN] },
  { path: '/teacher/dashboardTeacher', label: 'dashboardTeacher',roles: [Roles.TEACHER] },
  { path: '/parent/dashboardParent', label: 'dashboardParent',roles: [Roles.PARENT] },
  { path: '/admin/users', label: 'User Management', roles: [Roles.ADMIN] },
  { path: '/teacher/homework', label: 'Homework', roles: [Roles.TEACHER] },
  { path: '/parent/homework', label: 'Homework', roles: [Roles.PARENT] },
];
