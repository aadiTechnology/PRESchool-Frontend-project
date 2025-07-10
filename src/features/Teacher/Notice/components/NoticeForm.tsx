import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, MenuItem } from '@mui/material';

export interface NoticeFormValues {
  title: string;
  content: string;
  date: string;
  attachments: string[];
}

interface Props {
  onSubmit: (data: NoticeFormValues) => void;
  loading?: boolean;
  initialValues?: NoticeFormValues;
  onCancel?: () => void;
}

const NoticeForm: React.FC<Props> = ({ onSubmit, loading, initialValues, onCancel }) => {
  const [form, setForm] = useState<NoticeFormValues>(
    initialValues || { title: '', content: '', date: '', attachments: [] }
  );

  useEffect(() => {
    if (initialValues) setForm(initialValues);
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form); // form includes classId
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="content"
            label="Content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
        {/* Add attachments field if needed */}
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button type="button" variant="outlined" sx={{ mr: 2 }} onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NoticeForm;