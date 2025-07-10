import { API_URL } from '../../../../constants/config';

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  classId: number | null;
  date: string;
  attachments: string[];
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchNotices(): Promise<NoticeItem[]> {
  const res = await fetch(`${API_URL}/api/v1/auth/notices`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch notices');
  return res.json();
}

export async function fetchNoticeById(id: number): Promise<NoticeItem> {
  const res = await fetch(`${API_URL}/api/v1/auth/notices/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch notice');
  return res.json();
}

export async function addNotice(data: Omit<NoticeItem, 'id'>) {
  const res = await fetch(`${API_URL}/api/v1/auth/notices`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add notice');
  return res.json();
}

export async function updateNotice(id: number, data: Omit<NoticeItem, 'id'>) {
  const res = await fetch(`${API_URL}/api/v1/auth/notices/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update notice');
  return res.json();
}

export async function deleteNotice(id: number) {
  const res = await fetch(`${API_URL}/api/v1/auth/notices/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete notice');
}