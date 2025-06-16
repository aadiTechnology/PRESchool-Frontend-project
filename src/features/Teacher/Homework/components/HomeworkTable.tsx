import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Link
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface HomeworkAttachment {
  name: string;
  url: string;
}

export interface HomeworkItem {
  id: number;
  subjectName: string;
  homeworkDate: string;
  instructions: string;
  attachments: HomeworkAttachment[];
}

interface HomeworkTableProps {
  homework: HomeworkItem[];
  onEdit: (hw: HomeworkItem) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const HomeworkTable: React.FC<HomeworkTableProps> = ({ homework, onEdit, onDelete, loading }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Subject</TableCell>
          <TableCell>Homework Date</TableCell>
          <TableCell>Instructions</TableCell>
          <TableCell>Attachments</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {homework.map(hw => (
          <TableRow key={hw.id}>
            <TableCell>{hw.subjectName}</TableCell>
            <TableCell>{hw.homeworkDate}</TableCell>
            <TableCell>{hw.instructions}</TableCell>
            <TableCell>
              {hw.attachments.map(att => (
                <Link key={att.name} href={att.url} target="_blank" rel="noopener">{att.name}</Link>
              ))}
            </TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => onEdit(hw)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(hw.id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        {!loading && homework.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} align="center">No homework found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default HomeworkTable;