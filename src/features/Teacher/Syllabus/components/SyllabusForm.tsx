import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, MenuItem, Paper, Typography } from '@mui/material';

interface SyllabusFormProps {
  onSubmit: (data: { divisionId: number | string; month: string; file: File | null }) => void;
  loading?: boolean;
  initialValues?: { divisionId?: number | string; month?: string; file_name?: string };
  divisionOptions: { id: number; name: string }[];
  onCancel?: () => void; // <-- Add this
}

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const SyllabusForm: React.FC<SyllabusFormProps> = ({
  onSubmit,
  loading,
  initialValues,
  divisionOptions,
  onCancel, // <-- Add this
}) => {
  const [form, setForm] = useState({
    divisionId: initialValues?.divisionId || '',
    month: initialValues?.month || '',
    file: null as File | null,
  });
  const [currentFileName, setCurrentFileName] = useState<string | undefined>(
    // Assume initialValues.file is a File or initialValues.fileName is a string
    (initialValues as any)?.file_name || undefined
  );

  useEffect(() => {
    setForm({
      divisionId: initialValues?.divisionId || '',
      month: initialValues?.month || '',
      file: null,
    });
    setCurrentFileName((initialValues as any)?.file_name || undefined);
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setForm(prev => ({
      ...prev,
      file,
    }));
    setCurrentFileName(file ? file.name : (initialValues as any)?.file_name || undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.divisionId && form.month && (form.file || currentFileName)) {
      onSubmit({ ...form, file: form.file });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            name="divisionId"
            label="Division"
            value={form.divisionId}
            onChange={handleChange}
            fullWidth
            required
          >
            {divisionOptions.map(opt => (
              <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            name="month"
            label="Month"
            value={form.month}
            onChange={handleChange}
            fullWidth
            required
          >
            {months.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {currentFileName && (
            <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
              {currentFileName}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            sx={{ mr: 2 }}
            onClick={onCancel}
            disabled={loading}
          >
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

export default SyllabusForm;