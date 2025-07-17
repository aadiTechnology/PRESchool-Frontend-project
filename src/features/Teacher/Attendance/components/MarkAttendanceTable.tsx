import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Box } from '@mui/material';
import { Student, AttendanceRecord } from '../types/attendanceTypes';

interface Props {
  students: Student[];
  attendance: AttendanceRecord[];
  onChange: (userId: number, isPresent: boolean) => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
}

const MarkAttendanceTable: React.FC<Props> = ({ students, attendance, onChange, selectAll, onSelectAll }) => (
  <Box>
    <TableContainer component={Paper}>
      <Table>
        <TableHead >
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell align="center">
              Is Present
              <Checkbox
                checked={selectAll}
                onChange={e => onSelectAll(e.target.checked)}
                indeterminate={attendance.some(a => a.isPresent) && !selectAll}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(student => {
            const record = attendance.find(a => a.userId === student.userId);
            return (
              <TableRow key={student.userId}>
                <TableCell>{student.name}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={!!record?.isPresent}
                    onChange={e => onChange(student.userId, e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default MarkAttendanceTable;