import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Link
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoticeItem } from '../services/noticeService';
import { useNavigate } from 'react-router-dom';

// Add isParent prop
interface NoticeTableProps {
  notices: NoticeItem[];
  onEdit: (notice: NoticeItem) => void;
  onDelete: (id: number) => void;
  isParent?: boolean;
}

const NoticeTable: React.FC<NoticeTableProps> = ({ notices, onEdit, onDelete, isParent }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Attachments</TableCell>
            {!isParent && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {notices.map(notice => (
            <TableRow
              key={notice.id}
              hover
              style={{ cursor: 'pointer' }}
              onClick={e => {
                // Prevent navigation if clicking on a link (attachment)
                if ((e.target as HTMLElement).tagName !== 'A') {
                  // Use correct route for parent/teacher if needed
                  navigate(`/teacher/notices/${notice.id}`);
                }
              }}
            >
              <TableCell>{notice.title}</TableCell>
              <TableCell>{notice.date}</TableCell>
              <TableCell>{notice.content}</TableCell>
              <TableCell>
                {notice.attachments && notice.attachments.length > 0 ? (
                  notice.attachments.map((file, idx) => (
                    <Link
                      key={idx}
                      href={(notice.baseUrl || '') + file}
                      target="_blank"
                      rel="noopener"
                      sx={{ display: 'block' }}
                      onClick={e => e.stopPropagation()} // Prevent row click
                    >
                      {file && file ? file.toString().substring(11) : ''}
                    </Link>
                  ))
                ) : (
                  '-'
                )}
              </TableCell>
              {!isParent && (
                <TableCell>
                  <IconButton color="primary" onClick={e => { e.stopPropagation(); onEdit(notice); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={e => { e.stopPropagation(); onDelete(notice.id); }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
          {notices.length === 0 && (
            <TableRow>
              <TableCell colSpan={isParent ? 4 : 5} align="center">No notices found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NoticeTable;