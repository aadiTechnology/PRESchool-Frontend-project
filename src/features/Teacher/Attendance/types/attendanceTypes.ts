export interface Student {
  userId: number;
  name: string;
}

export interface AttendanceRecord {
  userId: number;
  isPresent: boolean;
  scanTime?: string;
}

export interface AttendanceSummary {
  userId: number;
  name: string;
  status: string; // e.g. "P", "A", "present", "absent", "true", "false"
  scanTime?: string;
}