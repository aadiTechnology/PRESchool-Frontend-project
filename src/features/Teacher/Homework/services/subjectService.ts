import { API_URL } from '../../../../constants/config';
import { SubjectOption } from '../components/AssignHomeworkForm';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Fetch subjects for a division
export const fetchSubjectsForClass = async (classId: number | string): Promise<SubjectOption[]> => {
  const url = `${API_URL}/api/v1/auth/subjects/?classId=${encodeURIComponent(classId)}`;
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