import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, TextField, Paper, Container } from '@mui/material';
import AttendanceSummaryTable from '../components/AttendanceSummaryTable';
import { fetchAttendance } from '../services/attendanceService';
import { AttendanceSummary } from '../types/attendanceTypes';
import { useNavigate, useSearchParams } from 'react-router-dom';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const divisionId = user.divisionId || ''; // fallback to empty string if not found

const AttendanceSummaryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState(() => searchParams.get('date') || new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchAttendance(divisionId, date)
      .then(data => {
        const normalized = data.map((rec: AttendanceSummary) => ({
          ...rec,
          status: typeof rec.status === 'string'
            ? rec.status.toLowerCase()
            : rec.status === true
              ? 'present'
              : 'absent'
        }));

        // Check if all students are absent
        const allAbsent = normalized.length > 0 && normalized.every(
          rec =>
            rec.status === 'absent' ||
            rec.status === 'a' ||
            rec.status === 'false' ||
            rec.status === '0'
        );

        if (allAbsent) {
          setRecords([]);
          setError('No Attendance Found for the selected date.');
        } else {
          setRecords(normalized);
          setError('');
        }
      })
      .catch(async (err) => {
        let message = 'Unable to load attendance. Please check your connection.';
        if (err && err.status === 404 && err.response) {
          try {
            const data = await err.response.json();
            if (
              data?.detail === 'No Attendance Found For This Date.' ||
              data?.message === 'No Attendance Found For This Date'
            ) {
              message = 'No Attendance Found for the selected date.';
            }
          } catch {}
        }
        setRecords([]);
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <Box>
          <Typography variant="h4" gutterBottom>Attendance Summary</Typography>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Select Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4} >
            <Button
             variant="contained"
             color="primary"
             fullWidth
             sx={{ height: '40px' }}
              onClick={() => navigate(`/teacher/attendance/mark?date=${date}`)}
            >
              Mark Attendance
            </Button>
          </Grid>
        </Grid>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <AttendanceSummaryTable records={records} loading={loading} />
        )}
      </Box>
  );
};

export default AttendanceSummaryPage;