import { API_URL } from '../../../../constants/config';
import { AssignHomeworkFormValues } from '../components/AssignHomeworkForm';

const ADD_API_URL = `${API_URL}/api/v1/auth/assign-homework`;
const EDIT_API_URL = `${API_URL}/api/v1/auth/homeworks`;

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem('token');
  const headers: any = {
    Authorization: `Bearer ${token}`,
  };
  // Do NOT set Content-Type for FormData, browser will set it automatically
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export const assignHomework = async (
  formData: AssignHomeworkFormValues & { divisionId: number | string; id?: number }
) => {
  const isEdit = !!formData.id;
  const fd = new FormData();
  fd.append('divisionId', String(formData.divisionId));
  fd.append('subjectId', String(formData.subjectId));
  fd.append('homeworkDate', formData.homeworkDate);
  fd.append('instructions', formData.instructions);

  if (formData.attachments && formData.attachments.length > 0) {
    for (const file of formData.attachments) {
      fd.append('attachments', file);
    }
  }

  const url = isEdit
    ? `${EDIT_API_URL}/${formData.id}`
    : ADD_API_URL;

  const res = await fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: getAuthHeaders(true), // true = isFormData
    body: fd,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || (isEdit ? 'Failed to update homework' : 'Failed to assign homework'));
  }
  return res.json();
};