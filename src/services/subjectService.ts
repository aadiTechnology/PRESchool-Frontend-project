import api from './api';

export interface SubjectOption {
  id: number;
  name: string;
}

export const fetchSubjectsForClass = async (className: string, token: string): Promise<SubjectOption[]> => {
  const response = await api.get(`/auth/subjects?className=${encodeURIComponent(className)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data as SubjectOption[];
};