import React from "react";
import { Box, Paper, Typography, Chip, Skeleton } from "@mui/material";

interface DailyAttendanceDetailsProps {
  selectedDate: string;
  dailyDetails: any;
  calendarData: any;
  loading: boolean;
}

const DailyAttendanceDetails: React.FC<DailyAttendanceDetailsProps> = ({
  selectedDate,
  dailyDetails,
  calendarData,
  loading,
}) => {
  const today = new Date();
  const selDate = new Date(selectedDate);

  // Find status for selected date
  const status =
    calendarData?.find((d: any) => d.date === selectedDate)?.status || "not-marked";

  // Validation: Hide details for future dates
  if (selDate > today) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Attendance Not Marked
        </Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Skeleton width={120} />
        <Skeleton width={80} />
        <Skeleton width={100} />
      </Paper>
    );
  }

  if (!dailyDetails || status === "not-marked") {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Attendance Not Marked
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {new Date(selectedDate).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Typography>
      <Typography variant="body2" mt={1}>
        <span role="img" aria-label="clock">⏰</span> Time In: {dailyDetails.scanTime}
      </Typography>
      <Box mt={1}>
        <Chip
          label={dailyDetails.status?.toLowerCase() === "present" ? "Present" : dailyDetails.status?.toLowerCase() === "absent" ? "Absent" : "Not Marked"}
          color={dailyDetails.status?.toLowerCase() === "present" ? "success" : dailyDetails.status?.toLowerCase() === "absent" ? "error" : "default"}
        />
      </Box>
      <Typography variant="body2" mt={1}>
        Teacher: {dailyDetails.teacherName}
      </Typography>
    </Paper>
  );
};

export default DailyAttendanceDetails;
// filepath: src/features/Parent/Attendance/components/DailyAttendanceDetails.tsx