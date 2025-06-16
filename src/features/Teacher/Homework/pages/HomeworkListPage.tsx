import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import HomeworkTable, { HomeworkItem } from '../components/HomeworkTable';
import AssignHomeworkForm, { AssignHomeworkFormValues, SubjectOption } from '../components/AssignHomeworkForm';
import { fetchHomeworkList, deleteHomework } from '../services/HomeworkService';
import { assignHomework } from '../services/assignHomeworkService';
import { fetchSubjectsForClass } from '../services/subjectService';

const HomeworkListPage: React.FC = () => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // For Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const divisionId = user.divisionId || '';
  const classId = user.classId || '';

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

  const fetchSubjects = async () => {
    setFetchingSubjects(true);
    try {
      if (classId) {
        const subjectList = await fetchSubjectsForClass(classId);
        setSubjects(subjectList);
      } else {
        setSubjects([]);
      }
    } catch {
      setSubjects([]);
    } finally {
      setFetchingSubjects(false);
    }
  };

  useEffect(() => {
    fetchList();
    fetchSubjects();
    // eslint-disable-next-line
  }, [divisionId, classId]);

  const handleEdit = (hw: HomeworkItem) => {
    // Implement edit logic if needed
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

  // Add Homework dialog handlers
  const handleAdd = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogSave = async (form: AssignHomeworkFormValues) => {
    try {
      await assignHomework({ ...form, divisionId });
      setSnackbar({ open: true, message: 'Homework added', severity: 'success' });
      setDialogOpen(false);
      fetchList();
    } catch {
      setSnackbar({ open: true, message: 'Failed to add homework', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Homework</Typography>
      <Typography variant="h6" gutterBottom>Assigned Homework</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleAdd}
      >
        Add Homework
      </Button>
      <HomeworkTable
        homework={homework}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Homework</DialogTitle>
        <DialogContent>
          <AssignHomeworkForm
            subjects={subjects}
            onSubmit={handleDialogSave}
            loading={fetchingSubjects}
          />
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeworkListPage;