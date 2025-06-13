export async function loginUser(email: string, password: string) {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  // Save role to localStorage for role-based routing
  if (data.user && data.user.role) {
    localStorage.setItem('role', data.user.role);
  }

  return data;
}
