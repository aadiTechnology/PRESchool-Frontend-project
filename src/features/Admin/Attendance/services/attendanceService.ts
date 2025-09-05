import { AttendanceUser, AttendanceStats } from '../types/attendanceTypes';

const API_BASE = 'http://localhost:8000/api/v1/auth/attendance';

// Scan attendance by QR code
export async function scanAttendance(qr_code: any): Promise<{
  status: string; // <-- Add this
  user: AttendanceUser;
  message: string;
  stats: AttendanceStats;
}> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qr_code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Scan failed. Try again.');
  }
  return {
    status: data.status, // <-- Add this
    user: data.user,
    message: data.message,
    stats: data.stats,
  };
}

// Get attendance stats for a date and preschool
export async function getAttendanceStats(date_: string): Promise<AttendanceStats> {
  const res = await fetch(`${API_BASE}/stats?date_=${date_}`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  const data = await res.json();
  return {
    totalScansToday: data.totalScansToday,
    teachersPresent: data.teachersPresent,
    studentsPresent: data.studentsPresent,
  };
}

// Save attendance
export async function saveAttendance(data: {
  userId: number;
  date_: string;
  status: string;
}): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  // Handle both success and failed (duplicate) responses
  if (!res.ok || result.status === 'failed') {
    throw new Error(result.message || 'Save failed');
  }
  return { status: result.status, message: result.message };
}