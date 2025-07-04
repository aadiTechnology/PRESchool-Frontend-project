import { API_URL } from '../../../../constants/config';

export interface SyllabusItem {
  id: number;
  divisionId: number;
  month: string;
  year: string;
  fileUrl?: string;
  file_name?: string;
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

export async function fetchSyllabus(divisionId: number | string): Promise<SyllabusItem[]> {
  const res = await fetch(`${API_URL}/api/v1/auth/syllabus?divisionId=${divisionId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch syllabus');
  return res.json();
}

export async function addSyllabus(form: { divisionId: any; month: string; file: File }) {
  const fd = new FormData();
  fd.append('divisionId', String(form.divisionId));
  fd.append('month', form.month);
  fd.append('file', form.file);

  const res = await fetch(`${API_URL}/api/v1/auth/syllabus`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: fd,
  });
  if (!res.ok) throw new Error('Failed to add syllabus');
  return res.json();
}

export async function updateSyllabus(id: number, file: File) {
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch(`${API_URL}/api/v1/auth/syllabus/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: fd,
  });
  if (!res.ok) throw new Error('Failed to update syllabus');
  return res.json();
}

export async function deleteSyllabus(id: number) {
  const res = await fetch(`${API_URL}/api/v1/auth/syllabus/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete syllabus');
}