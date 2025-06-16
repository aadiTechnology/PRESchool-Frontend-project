export interface RegisterUserParams {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  preschool_id: number;
  className?: string; // <-- Add this
  qualification?: string;
  childName?: string;
  childAge?: string;
}

export async function registerUser(params: RegisterUserParams): Promise<void> {
  const response = await fetch('http://localhost:8000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    // Try to get backend error message
    let msg = 'Registration failed';
    try {
      const data = await response.json();
      msg = data.detail || msg;
    } catch {}
    throw new Error(msg);
  }
}
