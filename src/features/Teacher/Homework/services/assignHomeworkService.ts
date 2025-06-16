import { AssignHomeworkFormValues } from '../components/AssignHomeworkForm';

const API_URL = 'http://localhost:8000/api/v1/auth/assign-homework';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const assignHomework = async (formData: AssignHomeworkFormValues & { divisionId: number | string }) => {
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

  const payload = {
    divisionId: formData.divisionId,
    homeworkDate: formData.homeworkDate,
    instructions: formData.instructions,
    subjectId: formData.subjectId,
    attachments,
  };

  const res = await fetch(API_URL, {
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