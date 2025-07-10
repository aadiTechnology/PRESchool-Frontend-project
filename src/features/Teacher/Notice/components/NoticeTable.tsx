import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoticeItem } from '../services/noticeService';

interface NoticeTableProps {
  notices: NoticeItem[];
  onEdit: (notice: NoticeItem) => void;
  onDelete: (id: number) => void;
}

const NoticeTable: React.FC<NoticeTableProps> = ({ notices, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Content</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {notices.map(notice => (
          <TableRow key={notice.id}>
            <TableCell>{notice.title}</TableCell>
            <TableCell>{notice.date}</TableCell>
            <TableCell>{notice.content}</TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => onEdit(notice)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(notice.id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        {notices.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} align="center">No notices found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default NoticeTable;