import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';

export interface NoticeFormValues {
  title: string;
  content: string;
  date: string;
  classId: number | null;
  attachments: File[]; // Remove divisionId
}

interface Props {
  onSubmit: (data: NoticeFormValues) => void;
  loading?: boolean;
  initialValues?: NoticeFormValues;
  onCancel?: () => void;
}

const NoticeForm: React.FC<Props> = ({ onSubmit, loading, initialValues, onCancel }) => {
  const [form, setForm] = useState<NoticeFormValues>(
    initialValues || { title: '', content: '', date: '', classId: null, attachments: [] }
  );

  useEffect(() => {
    if (initialValues) setForm({ ...initialValues, attachments: [] });
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setForm(prev => ({
      ...prev,
      attachments: files ? Array.from(files) : [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get divisionId from user object
    const divisionId = user.divisionId || null;
    onSubmit({ ...form }); // Pass divisionId from user object
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
        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload Attachments
            <input
              type="file"
              hidden
              multiple
              accept="application/pdf,image/*"
              onChange={handleFileChange}
            />
          </Button>
          {form.attachments && form.attachments.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {form.attachments.map((file, idx) => (
                <div key={idx}>{file.name}</div>
              ))}
            </div>
          )}
        </Grid>
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