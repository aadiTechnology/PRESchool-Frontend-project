import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';

export type UserType = {
  id: number;
  name: string;
  email: string;
  classId?: number;
  divisionId?: number;
  className?: string;
  // Add other user properties as needed
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const { setUser, setIsAuthenticated } = context;
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<UserType | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setUserState(response.user); // <-- Update user state on login
      setIsAuthenticated(true);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  // Updated register to match backend requirements
  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    classId: number;
    divisionId: number;
    preschoolId: number;
    role: number;
    childName: string;
    childAge: number;
  }) => {
    try {
      const registerParams = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        classId: userData.classId,
        divisionId: userData.divisionId,
        preschoolId: userData.preschoolId,
        role: userData.role,
        childName: userData.childName,
        childAge: userData.childAge,
      };
      await authService.register(registerParams);
      return;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setUserState(null); // <-- Clear user state on logout
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setUserState(JSON.parse(storedUser)); // <-- Initialize user state from localStorage
      }
    }
    setLoading(false);
  }, [setIsAuthenticated, setUser]);

  return { login, register, logout, loading, user };
};

export default useAuth;