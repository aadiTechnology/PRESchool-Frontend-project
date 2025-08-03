const API_BASE = "http://localhost:8000";

export const fetchAttendanceCalendar = async (
  userId: number,
  classId: number,
  divisionId: number,
  month: number,
  year: number,
  token: string
) => {
  const res = await fetch(
    `${API_BASE}/api/v1/auth/my-child/attendance/calendar?userId=${userId}&classId=${classId}&divisionId=${divisionId}&month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Remove credentials: "include" unless you use cookies for auth
    }
  );
  if (!res.ok) throw new Error("Failed to fetch attendance calendar");
  return res.json();
};

export const fetchDailyAttendance = async (
  userId: number,
  classId: number,
  divisionId: number,
  date: string,
  token: string
) => {
  const res = await fetch(
    `${API_BASE}/api/v1/auth/my-child/attendance/daily?userId=${userId}&classId=${classId}&divisionId=${divisionId}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Remove credentials: "include" unless you use cookies for auth
    }
  );
  if (!res.ok) throw new Error("Failed to fetch daily attendance");
  return res.json();
};