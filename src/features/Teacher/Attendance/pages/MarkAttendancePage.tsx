import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Snackbar,
  Alert,
  Container,
  CircularProgress,
} from '@mui/material';
import MarkAttendanceTable from '../components/MarkAttendanceTable';
import { fetchStudents, fetchAttendance, markAttendance } from '../services/attendanceService';
import { Student, AttendanceRecord } from '../types/attendanceTypes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SummaryCards from '../components/SummaryCards';

// Get divisionId from logged-in user (localStorage)
const user = JSON.parse(localStorage.getItem('user') || '{}');
const divisionId = user.divisionId || ''; // fallback to empty string if not found

const MarkAttendancePage: React.FC = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryDate = searchParams.get('date');
    if (queryDate) setDate(queryDate);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchStudents(divisionId),
      fetchAttendance(divisionId, date)
    ])
      .then(([studentsData, attendanceData]) => {
        setStudents(studentsData);

        // Check if any student has scanned
        const anyScanned = attendanceData.some(a => a.scanTime);

        if (attendanceData.length > 0) {
          setAttendance(
            studentsData.map(s => {
              const found = attendanceData.find(a => a.userId === s.userId);
              return {
                userId: s.userId,
                isPresent: anyScanned
                  ? !!found?.scanTime // checked if scanned, unchecked otherwise
                  : true // if no one scanned, default all to checked
              };
            })
          );
        } else {
          setAttendance(studentsData.map(s => ({ userId: s.userId, isPresent: true })));
        }
      })
      .catch(() => setError('Unable to load attendance. Please check your connection.'))
      .finally(() => setLoading(false));
  }, [date, divisionId]);

  // Validation (no Yup)
  const validate = () => {
    if (!date) {
      setSnackbar({ open: true, message: 'Please select a date.', severity: 'error' });
      return false;
    }
    if (attendance.length === 0 || !attendance.some(a => a.isPresent)) {
      setSnackbar({ open: true, message: 'At least one student must be marked present.', severity: 'error' });
      return false;
    }
    return true;
  };

  const handleAttendanceChange = (userId: number, isPresent: boolean) => {
    setAttendance(prev =>
      prev.map(a => (a.userId === userId ? { ...a, isPresent } : a))
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setAttendance(prev => prev.map(a => ({ ...a, isPresent: checked })));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const cleanAttendance = attendance.map(a => ({
        userId: Number(a.userId),
        isPresent: !!a.isPresent,
      }));
      await markAttendance(divisionId, date, cleanAttendance);
      setSnackbar({ open: true, message: 'Attendance saved successfully.', severity: 'success' });
      setTimeout(() => {
        navigate(`/teacher/attendance/summary?date=${date}`);
      }, 1200); // Wait for popup before navigating
    } catch {
      setSnackbar({ open: true, message: 'Failed to save attendance. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Attendance summary
  const total = attendance.length;
  const present = attendance.filter(a => a.isPresent).length;
  const absent = total - present;
  const percentage = total ? Math.round((present / total) * 100) : 0;

  const items = [
    { label: 'Present', value: present, color: 'success.main', bgcolor: '#e3fbe3' },
    { label: 'Absent', value: absent, color: 'error.main', bgcolor: '#fdeaea' },
    { label: 'Total Students', value: total },
    { label: 'Attendance %', value: `${percentage}%` },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom> Mark Attendance</Typography>
       
       <Box sx={{ bgcolor: '#fffbe6', borderRadius: 0.5, p: 1, mb: 2 }}>
            <Typography variant="subtitle1" align="center" color="text.secondary">
                Note: Select present/absent for each student and save attendance for the selected date.
            </Typography>
        </Box>
      <Grid container spacing={2} mb={4} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().slice(0, 10) }}
            size="small"
         />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '40px' }}
            onClick={() => navigate(`/teacher/attendance/summary?date=${date}`)}
          >
           Attendance Summary
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
         <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ height: '40px' }}
          onClick={handleSave}
          disabled={saving || loading}
         >
         Save Attendance
         </Button>
        </Grid>
      </Grid>
        <Grid container spacing={0.5} mb={2}>
          <SummaryCards items={items} />
        </Grid>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <MarkAttendanceTable
            students={students}
            attendance={attendance}
            onChange={handleAttendanceChange}
            selectAll={present === total}
            onSelectAll={handleSelectAll}
          />
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
        </Box>
  );
};

export default MarkAttendancePage;