export interface DivisionOption {
  id: number;
  name: string;
}

export async function fetchDivisions(classId: number): Promise<DivisionOption[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8000/api/v1/auth/divisions?classId=${classId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch divisions');
  return res.json();
}