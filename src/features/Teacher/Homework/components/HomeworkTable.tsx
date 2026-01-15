import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Link, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface HomeworkAttachment {
  name: string;
  url: string;
}

export interface HomeworkItem {
  id: number;
  subjectId: number;
  subjectName: string;
  homeworkDate: string;
  instructions: string;
  attachments: HomeworkAttachment[];
  baseUrl: string;
}

interface HomeworkTableProps {
  homework: HomeworkItem[];
  onEdit: (hw: HomeworkItem) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
  userRole: number;
  onRowClick?: (hw: HomeworkItem) => void;
}

const HomeworkTable: React.FC<HomeworkTableProps> = ({ homework, onEdit, onDelete, loading, userRole, onRowClick }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Subject</TableCell>
          <TableCell>Homework Date</TableCell>
          <TableCell>Instructions</TableCell>
          <TableCell>Attachments</TableCell>
          {userRole === 2 && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {homework.map(hw => (
          <TableRow
            key={hw.id}
            hover
            style={{ cursor: 'pointer' }}
            onClick={() => onRowClick && onRowClick(hw)}
          >
            <TableCell>{hw.subjectName}</TableCell>
            <TableCell>{hw.homeworkDate}</TableCell>
            <TableCell>
              <Tooltip title={hw.instructions} arrow>
                <span>
                  {hw.instructions.length > 20
                    ? hw.instructions.slice(0, 20) + '...'
                    : hw.instructions}
                </span>
              </Tooltip>
            </TableCell>
            <TableCell>
              {hw.attachments.map((att, i) => (
                <Link
                  key={i}
                  href={hw.baseUrl + att}
                  target="_blank"
                  rel="noopener"
                  onClick={e => e.stopPropagation()} // Prevent row click when clicking attachment
                >
                  {att && att ? att.toString().substring(11) : ''}
                </Link>
              ))}
            </TableCell>
            {userRole === 2 && (
              <TableCell
                onClick={e => e.stopPropagation()}
              >
                <IconButton color="primary" onClick={() => onEdit(hw)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(hw.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            )}
          </TableRow>
        ))}
        {!loading && homework.length === 0 && (
          <TableRow>
            <TableCell colSpan={userRole === 2 ? 5 : 4} align="center">No homework found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default HomeworkTable;