import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, CircularProgress, Alert } from '@mui/material';
import { fetchNotices, addNotice, updateNotice, deleteNotice, NoticeItem } from '../services/noticeService';
import NoticeForm,{NoticeFormValues} from '../components/NoticeForm';
import NoticeTable from '../components/NoticeTable';

const NoticeListPage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNotice, setEditNotice] = useState<NoticeItem | null>(null);
  const [error, setError] = useState('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const divisionId = user.divisionId || null; // Get divisionId from user object
      const data = await fetchNotices(user.classId, divisionId); // Pass divisionId
      setNotices(data);
    } catch {
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAdd = () => {
    setEditNotice(null);
    setDialogOpen(true);
  };

  const handleEdit = (notice: NoticeItem) => {
    setEditNotice(notice);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await deleteNotice(id);
      fetchList();
    } catch {
      setError('Failed to delete notice');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditNotice(null);
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const classId = user.classId || null;
  const divisionId = user.divisionId || null;
  const isParent = user.role === 3;

  const handleDialogSave = async (form: NoticeFormValues) => {
    try {
      if (editNotice) {
        await updateNotice(editNotice.id, { ...form, classId, divisionId }); // always send user's classId and divisionId
      } else {
        await addNotice({ ...form, classId, divisionId }); // always send user's classId and divisionId
      }
      setDialogOpen(false);
      setEditNotice(null);
      fetchList();
    } catch {
      setError('Failed to save notice');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Notices</Typography>
      {!isParent && (
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAdd}>
          Add Notice
        </Button>
      )}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <NoticeTable
          notices={notices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isParent={isParent} // pass to table
        />
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editNotice ? 'Edit Notice' : 'Add Notice'}</DialogTitle>
        <DialogContent>
          <NoticeForm
            onSubmit={handleDialogSave}
            loading={loading}
            initialValues={editNotice || undefined}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NoticeListPage;