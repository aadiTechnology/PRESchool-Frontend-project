import { SubjectOption } from '../components/AssignHomeworkForm';

const API_URL = 'http://localhost:8000/api/v1/auth/subjects';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const fetchSubjectsForClass = async (className: string): Promise<SubjectOption[]> => {
  const url = `${API_URL}?className=${encodeURIComponent(className)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || 'Failed to fetch subjects');
  }
  return res.json();
};