import { HomeworkItem } from '../components/HomeworkTable';

const API_URL = 'http://localhost:8000/api/v1/auth/homeworks';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchHomeworkList(divisionId: number | string): Promise<HomeworkItem[]> {
  const res = await fetch(`${API_URL}?divisionId=${divisionId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch homework');
  return res.json();
}

export async function deleteHomework(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete homework');
}

export async function fetchHomeworkById(id: string | number) {
  const res = await fetch(`http://localhost:8000/api/v1/auth/homeworks/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch homework');
  return res.json();
}