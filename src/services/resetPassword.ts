export async function resetPassword(email: string, newPassword: string) {
  const response = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, new_password: newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to reset password');
  }

  return data;
}