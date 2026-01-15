import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import AttendanceCalendar from "../Attendance/components/AttendanceCalendar";
import SummaryCards from "../../Teacher/Attendance/components/SummaryCards";
import {
  fetchAttendanceCalendar,
} from "../Attendance/services/myChildAttendanceService";

const MyChildAttendancePage: React.FC = () => {
  console.log("MyChildAttendancePage mounted");
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const USER_ID = user?.id;
  const CLASS_ID = user?.classId;
  const DIVISION_ID = user?.divisionId;

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(
    `${year}-${String(month).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [calendarData, setCalendarData] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [childName, setChildName] = useState<string>("");
  const [selectedDateStatus, setSelectedDateStatus] = useState<string>("");

  // Fetch calendar data
  useEffect(() => {
    if (!USER_ID || !CLASS_ID || !DIVISION_ID) return;
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    fetchAttendanceCalendar(USER_ID, CLASS_ID, DIVISION_ID, month, year, token)
      .then((data) => {
        setCalendarData(data.calendar);
        setSummary({
          presentDays: data.presentDays,
          absentDays: data.absentDays,
          attendanceRate: data.attendanceRate,
        });
        setChildName(data.childName); // <-- add this line
      })
      .finally(() => setLoading(false));
  }, [USER_ID, CLASS_ID, DIVISION_ID, month, year]);

  useEffect(() => {
    // Update selectedDateStatus whenever selectedDate or calendarData changes
    if (!calendarData) {
      setSelectedDateStatus("");
      return;
    }
    const entry = calendarData.find((d: any) => d.date === selectedDate);
    setSelectedDateStatus(entry?.status || "not-marked");
  }, [selectedDate, calendarData]);

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDate(`${newYear}-${String(newMonth).padStart(2, "0")}-01`);
  };

  // Prepare summary items for SummaryCards
  const summaryItems = [
    {
      label: "Present Days",
      value: summary?.presentDays ?? 0,
      color: "success.main",
      bgcolor: "#e3fbe3",
    },
    {
      label: "Absent Days",
      value: summary?.absentDays ?? 0,
      color: "error.main",
      bgcolor: "#fdeaea",
    },
    {
      label: "Attendance Rate",
      value: (summary?.attendanceRate ?? 0) + "%",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        My Child's Attendance
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Child Name: {childName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Class: {user?.className}
        </Typography>
      </Paper>
      <SummaryCards items={summaryItems} columns={3} />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8} lg={6} display="flex" justifyContent="center">
          <Box sx={{ width: "100%", maxWidth: 1200 }}>
            <AttendanceCalendar
              month={month}
              year={year}
              calendarData={calendarData}
              onMonthChange={handleMonthChange}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              loading={loading}
              selectedDateStatus={selectedDateStatus} // pass status
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyChildAttendancePage;
// filepath: src/features/Parent/Attendance/pages/MyChildAttendancePage.tsx