import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import SyllabusTable from '../components/SyllabusTable';
import SyllabusForm from '../components/SyllabusForm';
import { fetchSyllabus, addSyllabus, updateSyllabus, deleteSyllabus, SyllabusItem } from '../services/syllabusService';

const SyllabusPage: React.FC = () => {
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSyllabus, setEditSyllabus] = useState<SyllabusItem | null>(null);
  const [dialogError, setDialogError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role; // 2 = teacher, 3 = parent
  const divisionId = user.divisionId || '';

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await fetchSyllabus(divisionId);
      setSyllabus(data);
    } catch {
      setError('Failed to load syllabus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, [divisionId, user.classId]);

  const handleAdd = () => {
    setEditSyllabus(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: SyllabusItem) => {
    setEditSyllabus(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this syllabus?')) return;
    try {
      await deleteSyllabus(id);
      fetchList();
    } catch {
      setError('Failed to delete syllabus');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditSyllabus(null);
    setDialogError('');
  };

  const handleDialogSave = async (form: { month: string; file: File | null }) => {
    try {
      if (editSyllabus && form.file) {
        await updateSyllabus(editSyllabus.id, form.file);
      } else if (!editSyllabus && form.file) {
        await addSyllabus({ divisionId, month: form.month, file: form.file });
      }
      setDialogOpen(false);
      setEditSyllabus(null);
      setDialogError('');
      fetchList();
    } catch (err: any) {
      let message = 'Failed to save syllabus';
      // Try to extract error message from API response
      if (err && err.response) {
        try {
          const data = await err.response.json();
          message = data?.detail || data?.message || message;
        } catch {}
      } else if (err && err.message) {
        message = err.message;
      }
      setDialogError(message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Syllabus</Typography>
      {userRole === 2 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleAdd}
        >
          Add Syllabus
        </Button>
      )}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <SyllabusTable
          syllabus={syllabus}
          userRole={userRole}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editSyllabus ? 'Edit Syllabus' : 'Add Syllabus'}</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dialogError}
            </Alert>
          )}
          <SyllabusForm
            onSubmit={handleDialogSave}
            initialValues={
              editSyllabus
                ? {
                    month: editSyllabus.month,
                    file_name: editSyllabus.file_name,
                  }
                : undefined
            }
            // usedMonths={editSyllabus ? [] : usedMonths}
            onCancel={handleDialogClose}
            isEdit={!!editSyllabus}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SyllabusPage;