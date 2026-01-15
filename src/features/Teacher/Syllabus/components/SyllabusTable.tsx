import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SyllabusItem } from '../services/syllabusService';

interface SyllabusTableProps {
  syllabus: SyllabusItem[];
  userRole: number;
  onEdit: (item: SyllabusItem) => void;
  onDelete: (id: number) => void;
}

const SyllabusTable: React.FC<SyllabusTableProps> = ({ syllabus, userRole, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>File</TableCell>
          {userRole === 2 && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {syllabus.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.month + "-" + item.year}</TableCell>
            <TableCell>
              {item.fileUrl ? (
                <Link href={item.fileUrl} target="_blank" rel="noopener">
                  {item.file_name}
                </Link>
              ) : (
                '-'
              )}
            </TableCell>
            {userRole === 2 && (
              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SyllabusTable;