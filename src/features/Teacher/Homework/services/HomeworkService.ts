import { API_URL } from '../../../../constants/config';
import { HomeworkItem } from '../components/HomeworkTable';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchHomeworkList(divisionId: number | string): Promise<HomeworkItem[]> {
  const res = await fetch(`${API_URL}/api/v1/auth/homeworks?divisionId=${divisionId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch homework');
  return res.json();
}

export async function deleteHomework(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/auth/homeworks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete homework');
}

export async function fetchHomeworkById(id: string | number) {
  const res = await fetch(`${API_URL}/api/v1/auth/homeworks/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch homework');
  return res.json();
}