import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import HomeworkTable, { HomeworkItem } from '../components/HomeworkTable';
import AssignHomeworkForm, { AssignHomeworkFormValues, SubjectOption } from '../components/AssignHomeworkForm';
import { fetchHomeworkList, deleteHomework } from '../services/HomeworkService';
import { assignHomework } from '../services/assignHomeworkService';
import { fetchSubjectsForClass } from '../services/subjectService';
import { useNavigate } from 'react-router-dom';

const HomeworkListPage: React.FC = () => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editHomework, setEditHomework] = useState<HomeworkItem | null>(null);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role; // 2 = teacher, 3 = parent

  const divisionId = user.divisionId || '';
  const classId = user.classId || '';

  const navigate = useNavigate();

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

  // Add Homework
  const handleAdd = () => {
    setEditHomework(null);
    setDialogOpen(true);
  };

  // Edit Homework
  const handleEdit = (hw: HomeworkItem) => {
    setEditHomework(hw);
    setDialogOpen(true);
  };

  // Delete Homework
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

  // Dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditHomework(null);
  };

  // Save (add or edit)
  const handleDialogSave = async (form: AssignHomeworkFormValues) => {
    try {
      // If editing, pass homework id to the service (update logic)
      await assignHomework({ ...form, divisionId, id: editHomework?.id });
      setSnackbar({ open: true, message: editHomework ? 'Homework updated' : 'Homework added', severity: 'success' });
      setDialogOpen(false);
      setEditHomework(null);
      fetchList();
    } catch {
      setSnackbar({ open: true, message: 'Failed to save homework', severity: 'error' });
    }
  };

  // Prepare initial values for edit
  const getInitialFormValues = (): AssignHomeworkFormValues => {
    if (!editHomework) {
      return { subjectId: '', homeworkDate: '', instructions: '', attachments: [] };
    }
    // Map subjectName to subjectId
    const subject = subjects.find(s => s.name === editHomework.subjectName);
    return {
      subjectId: subject ? subject.id : '',
      homeworkDate: editHomework.homeworkDate || '',
      instructions: editHomework.instructions || '',
      attachments: [],
    };
  };

  const handleRowClick = (hw: HomeworkItem) => {
    navigate(`/teacher/homework/${hw.id}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Homework</Typography>
      <Typography variant="h6" gutterBottom>Assigned Homework</Typography>
      {userRole === 2 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleAdd}
        >
          Add Homework
        </Button>
      )}
      <HomeworkTable
        homework={homework}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        userRole={userRole}
        onRowClick={handleRowClick}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editHomework ? 'Edit Homework' : 'Add Homework'}</DialogTitle>
        <DialogContent>
          <AssignHomeworkForm
            subjects={subjects}
            onSubmit={handleDialogSave}
            loading={fetchingSubjects}
            initialValues={getInitialFormValues()}
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