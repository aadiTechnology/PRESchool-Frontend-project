export interface AttendanceUser {
  id: number;
  date: string;
  scanTime?: string;
  preschool_id?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  childName?: string;
  role?: number | string;
  className?: string | null;
  divisionName?: string | null;
  divisionId?: number;
}

export interface AttendanceStats {
  totalScansToday: number;
  teachersPresent: number;
  studentsPresent: number;
}