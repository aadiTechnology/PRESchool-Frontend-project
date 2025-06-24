export async function verifyOtp(email: string, otp: string) {
  const response = await fetch('http://apinew.smartkidzwakad.com/api/v1/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Invalid OTP. Please try again.');
  }

  return data;
}