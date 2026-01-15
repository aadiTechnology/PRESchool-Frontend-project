import { API_URL } from '../../../constants/config';
export interface ClassOption {
  id: number;
  name: string;
}

export async function fetchClasses(preschoolId: number): Promise<ClassOption[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/auth/classes?preschoolId=${preschoolId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}