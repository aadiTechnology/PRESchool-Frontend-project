import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, MenuItem, Typography } from '@mui/material';

interface SyllabusFormProps {
  onSubmit: (data: { month: string; file: File | null }) => void;
  loading?: boolean;
  initialValues?: { month?: string; file_name?: string };
  onCancel?: () => void;
  isEdit?: boolean;
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

const getCurrentMonth = () => {
  const now = new Date();
  return String(now.getMonth() + 1).padStart(2, '0');
};

const SyllabusForm: React.FC<SyllabusFormProps> = ({
  onSubmit,
  loading,
  initialValues,
  onCancel,
  isEdit = false,
}) => {
  const [form, setForm] = useState({
    month: initialValues?.month || getCurrentMonth(), // <-- default to current month
    file: null as File | null,
  });
  const [currentFileName, setCurrentFileName] = useState<string | undefined>(
    (initialValues as any)?.file_name || undefined
  );
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    setForm({
      month: initialValues?.month || getCurrentMonth(), // <-- default to current month
      file: null,
    });
    setCurrentFileName((initialValues as any)?.file_name || undefined);
    setFileError('');
  }, [initialValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (
      file &&
      !(
        file.type === 'application/pdf' ||
        file.type.startsWith('image/')
      )
    ) {
      setFileError('Only PDF and image files are allowed.');
      setForm(prev => ({ ...prev, file: null }));
      return;
    }
    setFileError('');
    setForm(prev => ({
      ...prev,
      file,
    }));
    setCurrentFileName(file ? file.name : (initialValues as any)?.file_name || undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.month && (form.file || currentFileName)) {
      onSubmit({ month: form.month, file: form.file });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            name="month"
            label="Month"
            value={form.month}
            onChange={handleChange}
            fullWidth
            required
            disabled={isEdit}
          >
            {months.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload File
            <input
              type="file"
              hidden
              accept="application/pdf,image/*"
              onChange={handleFileChange}
            />
          </Button>
          {currentFileName && (
            <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
              {currentFileName}
            </Typography>
          )}
          {fileError && (
            <Typography color="error" variant="caption" sx={{ ml: 2, display: 'block' }}>
              {fileError}
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