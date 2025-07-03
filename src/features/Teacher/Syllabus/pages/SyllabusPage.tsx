import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import SyllabusTable from '../components/SyllabusTable';
import SyllabusForm from '../components/SyllabusForm';
import { fetchSyllabus, addSyllabus, updateSyllabus, deleteSyllabus, SyllabusItem } from '../services/syllabusService';
import { fetchDivisions, DivisionOption } from '../../../Admin/services/divisionService'

const SyllabusPage: React.FC = () => {
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSyllabus, setEditSyllabus] = useState<SyllabusItem | null>(null);
  const [divisionOptions, setDivisionOptions] = useState<DivisionOption[]>([]);
  const [fetchingDivisions, setFetchingDivisions] = useState(false);

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

  const fetchDivisionOptions = async () => {
    setFetchingDivisions(true);
    try {
      if (user.classId) {
        const divisions = await fetchDivisions(user.classId);
        setDivisionOptions(divisions);
      }
    } catch {
      setDivisionOptions([]);
    } finally {
      setFetchingDivisions(false);
    }
  };

  useEffect(() => {
    fetchList();
    fetchDivisionOptions();
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
  };

  const handleDialogSave = async (form: { divisionId: number | string; month: string; file: File | null }) => {
    try {
      if (editSyllabus && form.file) {
        await updateSyllabus(editSyllabus.id, form.file);
      } else if (!editSyllabus && form.file) {
        await addSyllabus(form as any);
      }
      setDialogOpen(false);
      setEditSyllabus(null);
      fetchList();
    } catch {
      setError('Failed to save syllabus');
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
          <SyllabusForm
            onSubmit={handleDialogSave}
            loading={fetchingDivisions}
            initialValues={editSyllabus ? { divisionId: editSyllabus.divisionId, month: editSyllabus.month, file_name:editSyllabus.file_name } : undefined}
            divisionOptions={divisionOptions}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SyllabusPage;