import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AttendanceSummary } from '../types/attendanceTypes';
import CancelIcon from '@mui/icons-material/Cancel';


interface Props {
  records: AttendanceSummary[];
  loading: boolean;
}

const AttendanceSummaryTable: React.FC<Props> = ({ records, loading }) => (
  <Box>
     <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell>Attendance Status</TableCell>
            <TableCell>Scan Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}><Typography>Loading...</Typography></TableCell>
            </TableRow>
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}><Typography>No Attendance Found for the selected date.</Typography></TableCell>
            </TableRow>
          ) : (
            records.map(rec => (
              <TableRow key={rec.userId}>
                <TableCell>{rec.name}</TableCell>
                <TableCell>
                  {rec.status === 'present' || rec.status === 'p' || rec.status === 'true' || rec.status === '1' ? (
                    <Box display="flex" alignItems="center" color="success.main">
                      <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Present
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" color="error.main">
                      <CancelIcon fontSize="small" sx={{ mr: 1 }} /> Absent
                    </Box>
                  )}
                </TableCell>
                <TableCell>{rec.scanTime || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default AttendanceSummaryTable;