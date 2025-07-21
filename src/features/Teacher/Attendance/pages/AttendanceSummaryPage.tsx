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
        // Normalize status to "present"/"absent"
        const normalized = data.map((rec: AttendanceSummary) => ({
          ...rec,
          status: typeof rec.status === 'string'
            ? rec.status.toLowerCase()
            : rec.status === true
              ? 'present'
              : 'absent'
        }));
        setRecords(normalized);
      })
      .catch(() => setError('Unable to load attendance. Please check your connection.'))
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
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