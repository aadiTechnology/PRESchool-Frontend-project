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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  className?: string;      // For Teacher (instead of subject)
  qualification?: string;     // For Teacher
  childName?: string;         // For Parent
  childAge?: string;          // For Parent
  childClass?: string;        // For Parent
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