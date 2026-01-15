import { API_URL } from '../../../../constants/config';

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  classId: number | null;
  date: string;
  attachments: File[];
  baseUrl?: string;
}

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem('token');
  const headers: any = {
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function fetchNotices(classId?: number, divisionId?: number): Promise<NoticeItem[]> {
  const queryParams = new URLSearchParams();
  if (classId) queryParams.append('classId', String(classId));
  if (divisionId) queryParams.append('divisionId', String(divisionId));

  const res = await fetch(`${API_URL}/api/v1/auth/notices?${queryParams.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch notices');
  return res.json();
}

export async function fetchNoticeById(id: number): Promise<NoticeItem> {
  const res = await fetch(`${API_URL}/api/v1/auth/notices/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch notice');
  return res.json();
}

export async function addNotice(data: Omit<NoticeItem, 'id'> & { divisionId: number; attachments?: File[] }) {
  const fd = new FormData();
  fd.append('title', data.title);
  fd.append('content', data.content);
  fd.append('classId', data.classId ? String(data.classId) : '');
  fd.append('divisionId', String(data.divisionId)); // Pass divisionId from user object
  fd.append('date', data.date);
  if (data.attachments && data.attachments.length > 0) {
    for (const file of data.attachments) {
      fd.append('attachments', file);
    }
  }
  const res = await fetch(`${API_URL}/api/v1/auth/notices`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: fd,
  });
  if (!res.ok) throw new Error('Failed to add notice');
  return res.json();
}

export async function updateNotice(id: number, data: Omit<NoticeItem, 'id'> & { divisionId: number; attachments?: File[] }) {
  const fd = new FormData();
  fd.append('title', data.title);
  fd.append('content', data.content);
  fd.append('classId', data.classId ? String(data.classId) : '');
  fd.append('divisionId', String(data.divisionId)); // Pass divisionId from user object
  fd.append('date', data.date);
  if (data.attachments && data.attachments.length > 0) {
    for (const file of data.attachments) {
      fd.append('attachments', file);
    }
  }
  const res = await fetch(`${API_URL}/api/v1/auth/notices/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: fd,
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