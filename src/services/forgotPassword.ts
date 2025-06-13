export async function forgotPassword(email: string) {
  const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to send OTP');
  }

  return data;
}