import { API_URL } from '../../../constants/config';
import { User } from '../../../types';

const API_URL_USERS = `${API_URL}/api/v1/auth/users`

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(API_URL_USERS, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function addUser(user: Partial<User>): Promise<User> {
  const headers = getAuthHeaders();
  console.log('Add User Headers:', headers); // Debug
  const res = await fetch(API_URL_USERS, {
    method: 'POST',
    headers,
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

export async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL_USERS}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL_USERS}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete user');
}