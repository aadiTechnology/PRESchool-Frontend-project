import { AssignHomeworkFormValues } from '../components/AssignHomeworkForm';

const ADD_API_URL = 'http://apinew.smartkidzwakad.com/api/v1/auth/assign-homework';
const EDIT_API_URL = 'http://apinew.smartkidzwakad.com/api/v1/auth/homeworks';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const assignHomework = async (
  formData: AssignHomeworkFormValues & { divisionId: number | string; id?: number }
) => {
  let attachments: any[] = [];
  if (formData.attachments && formData.attachments.length > 0) {
    attachments = await Promise.all(
      formData.attachments.map(async (file) => {
        const buffer = await file.arrayBuffer();
        return {
          name: file.name,
          type: file.type,
          data: Array.from(new Uint8Array(buffer)),
        };
      })
    );
  }

  // For update, use the required JSON body and endpoint
  if (formData.id) {
    const payload = {
      id: formData.id,
      divisionId: formData.divisionId,
      subjectId: formData.subjectId,
      homeworkDate: formData.homeworkDate,
      instructions: formData.instructions,
      attachments,
    };
    const res = await fetch(`${EDIT_API_URL}/${formData.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.message || 'Failed to update homework');
    }
    return res.json();
  }

  // For add
  const payload = {
    divisionId: formData.divisionId,
    homeworkDate: formData.homeworkDate,
    instructions: formData.instructions,
    subjectId: formData.subjectId,
    attachments,
  };
  const res = await fetch(ADD_API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || 'Failed to assign homework');
  }
  return res.json();
};