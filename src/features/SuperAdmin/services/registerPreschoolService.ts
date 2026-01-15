import api from '../../../services/api';
import { PreschoolRegistrationForm } from '../components/RegisterPreschoolForm';

export const registerPreschool = async (formData: PreschoolRegistrationForm) => {
  const response = await api.post('/auth/register-preschool', formData);
  return response.data;
};