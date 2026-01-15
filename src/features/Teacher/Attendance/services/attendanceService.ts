import { API_URL } from '../../../../constants/config';
import { Student, AttendanceRecord, AttendanceSummary } from '../types/attendanceTypes';

const API_BASE = 'http://localhost:8000/api/v1/auth/attendance';

export async function fetchStudents(divisionId: number): Promise<Student[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/auth/attendance/students?divisionId=${divisionId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function fetchAttendance(divisionId: number, date: string): Promise<AttendanceSummary[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/auth/attendance?divisionId=${divisionId}&date=${date}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

export async function markAttendance(divisionId: number, date: string, attendance: AttendanceRecord[]): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/auth/attendance/mark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      divisionId: Number(divisionId),
      date: date,
      attendance: attendance.map(a => ({
        userId: Number(a.userId),
        isPresent: !!a.isPresent,
      })),
    }),
  });
  if (!res.ok) throw new Error('Failed to save attendance');
}