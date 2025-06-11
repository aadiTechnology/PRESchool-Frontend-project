// This file exports global TypeScript types and interfaces.

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface RegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface MenuItem {
  title: string;
  path: string;
  roles: Array<string>;
}

export interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ScreenAccessConfig {
  path: string;
  allowedRoles: string[];
}