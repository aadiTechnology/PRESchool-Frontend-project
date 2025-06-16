import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import HomeworkTable, { HomeworkItem } from '../components/HomeworkTable';
import { fetchHomeworkList, deleteHomework } from '../services/HomeworkService';
// import { fetchHomeworkList, deleteHomework } from '../services/homeworkService';

const HomeworkListPage: React.FC = () => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const divisionId = user.divisionId || '';

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await fetchHomeworkList(divisionId);
      setHomework(data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch homework', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, [divisionId]);

  const handleEdit = (hw: HomeworkItem) => {
    // Implement edit logic or navigation
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this homework?')) return;
    try {
      await deleteHomework(id);
      setSnackbar({ open: true, message: 'Homework deleted', severity: 'success' });
      fetchList();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete homework', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Homework</Typography>
      <Typography variant="h6" gutterBottom>Assigned Homework</Typography>
      <HomeworkTable
        homework={homework}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeworkListPage;