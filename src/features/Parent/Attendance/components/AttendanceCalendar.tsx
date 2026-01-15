import React from "react";
import { Box, IconButton, Typography, Paper, Grid, Skeleton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { alpha } from "@mui/material/styles";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface AttendanceCalendarProps {
  month: number;
  year: number;
  calendarData: any;
  onMonthChange: (month: number, year: number) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  loading: boolean;
  selectedDateStatus?: string; // add prop
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  month,
  year,
  calendarData,
  onMonthChange,
  selectedDate,
  setSelectedDate,
  loading,
  selectedDateStatus = "",
}) => {
  // Calculate first day of month and days in month
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  // Helper to get status for a date
  const getStatus = (date: number) => {
    if (!calendarData) return "not-marked";
    const entry = calendarData.find((d: any) => d.date.endsWith(`-${String(date).padStart(2, "0")}`));
    return entry?.status || "not-marked";
  };

  // Handle month navigation
  const handlePrev = () => {
    if (month === 1) onMonthChange(12, year - 1);
    else onMonthChange(month - 1, year);
  };
  const handleNext = () => {
    if (month === 12) onMonthChange(1, year + 1);
    else onMonthChange(month + 1, year);
  };

  // Build calendar grid
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const getStatusBg = (status: string, isSelected: boolean) => {
    if (isSelected) {
      // Blue highlight for selected date (daily attendance)
      return "rgba(33, 150, 243, 0.18)"; // light blue with blur effect
    }
    switch (status?.toLowerCase()) {
      case "present":
        return("#58ee60ff"); // light green blur
      case "absent":
        return ("#f48078ff"); // light red blur
      case "not marked":
      case "notmarked":
        return alpha("#90caf9", 0.10); // light blue/gray blur
      default:
        return "transparent";
    }
  };

  // Helper to check if selected date is in the future
  const isFutureDate = (() => {
    const selected = new Date(selectedDate);
    const today = new Date();
    selected.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return selected > today;
  })();

  // Show "Attendance is not Marked" for past/today dates with status "not-marked"
  const showNotMarkedMsg =
    !isFutureDate &&
    selectedDateStatus?.toLowerCase().replace(/\s/g, "") === "notmarked";

  // Helper to check if selected date is in current month
  const isCurrentMonth = (() => {
    const selected = new Date(selectedDate);
    return selected.getMonth() + 1 === month && selected.getFullYear() === year;
  })();

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <IconButton onClick={handlePrev}><ArrowBackIosNewIcon /></IconButton>
        <Typography variant="h6" mx={2}>{monthNames[month - 1]} {year}</Typography>
        <IconButton onClick={handleNext}><ArrowForwardIosIcon /></IconButton>
      </Box>
      <Grid container spacing={0.5}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <Grid item xs={1.71} key={day}>
            <Typography variant="caption" fontWeight={600}>{day}</Typography>
          </Grid>
        ))}
        <Grid container spacing={0.5}>
          {calendarCells.map((date, idx) => {
            if (!date) {
              return <Grid item xs={1.71} key={idx}><Box sx={{ width: 36, height: 36 }} /></Grid>;
            }
            const entry = calendarData?.find((d: any) => d.date.endsWith(`-${String(date).padStart(2, "0")}`));
            const status = entry?.status || "not-marked";
            const isSelected = selectedDate.endsWith(`-${String(date).padStart(2, "0")}`);
            return (
              <Grid item xs={1.71} key={idx}>
                <Box
                  onClick={() => setSelectedDate(`${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`)}
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                    bgcolor: getStatusBg(status, isSelected),
                    border: isSelected ? "2px solid #2196f3" : "1px solid #e0e0e0",
                    boxShadow: isSelected ? "0 0 8px 2px #2196f344" : "none",
                    fontWeight: isSelected ? 700 : 400,
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  <Typography color={isSelected ? "#1976d2" : "inherit"}>
                    {date}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      {/* Message for future dates only */}
      {isFutureDate && (
        <Box mt={2}>
          <Typography color="error" variant="body2" fontWeight={500}>
            Future Date attendance is not allowed.
          </Typography>
        </Box>
      )}
      {/* Message for not marked past/today dates */}
      {showNotMarkedMsg && (
        <Box mt={2}>
          <Typography color="error" variant="body2" fontWeight={500}>
            Attendance is not Marked.
          </Typography>
        </Box>
      )}
      <Box mt={2} display="flex" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 16, bgcolor: "#58ee60ff", borderRadius: "50%" }} />
          <Typography variant="caption">Present</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 16, bgcolor: "#f48078ff", borderRadius: "50%" }} />
          <Typography variant="caption">Absent</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 16, bgcolor: "grey.400", borderRadius: "50%" }} />
          <Typography variant="caption">Not Marked</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AttendanceCalendar;
// filepath: src/features/Parent/Attendance/components/AttendanceCalendar.tsx