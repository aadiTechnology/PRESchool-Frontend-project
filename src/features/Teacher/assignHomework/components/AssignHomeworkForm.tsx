import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
  InputLabel,
  Select,
  FormControl,
  Tooltip,
} from '@mui/material';

export interface SubjectOption {
  id: number;
  name: string;
}

export interface AssignHomeworkFormValues {
  subjectId: number | '';
  homeworkDate: string;
  instructions: string;
  attachments: File[];
}

interface Props {
  subjects: SubjectOption[];
  onSubmit: (data: AssignHomeworkFormValues) => void;
  loading?: boolean;
}

const AssignHomeworkForm: React.FC<Props> = ({
  subjects,
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState<AssignHomeworkFormValues>({
    subjectId: '',
    homeworkDate: '',
    instructions: '',
    attachments: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    setErrors({});
  };

  const handleSelectChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      subjectId: e.target.value,
    }));
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setForm((prev) => ({
      ...prev,
      attachments: files ? Array.from(files) : [],
    }));
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.subjectId) newErrors.subjectId = 'Please select Subject';
    if (!form.homeworkDate) newErrors.homeworkDate = 'Please select date';
    if (!form.instructions) newErrors.instructions = 'Enter instructions';
    // attachments are NOT mandatory anymore
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assign Homework
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Share instructions and upload files for your class
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.subjectId}>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subjectId"
              value={form.subjectId}
              label="Subject"
              displayEmpty
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Please select Subject</em>
              </MenuItem>
              {subjects.length === 0 && (
                <MenuItem value="" disabled>
                  No Subject found. Contact your admin to get assigned.
                </MenuItem>
              )}
              {subjects.map((subj) => (
                <MenuItem key={subj.id} value={subj.id}>
                  {subj.name}
                </MenuItem>
              ))}
            </Select>
            {errors.subjectId && (
              <Typography color="error" variant="caption">
                {errors.subjectId}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="homeworkDate"
            label="Homework Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="Select date"
            value={form.homeworkDate}
            onChange={handleChange}
            error={!!errors.homeworkDate}
            helperText={errors.homeworkDate}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="instructions"
            label="Instructions"
            placeholder="Enter instructions"
            fullWidth
            multiline
            minRows={4}
            value={form.instructions}
            onChange={handleChange}
            error={!!errors.instructions}
            helperText={errors.instructions}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{ p: 3, borderStyle: 'dashed', textAlign: 'center' }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Upload Attachments (Multiple)
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              You can upload multiple files (PDFs, images) to support the homework.
            </Typography>
            <Tooltip title="Tip: You can upload more than one file to give students additional resources.">
              <Button variant="outlined" component="label">
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Tooltip>
            {errors.attachments && (
              <Typography color="error" variant="caption" display="block" mt={1}>
                {errors.attachments}
              </Typography>
            )}
            {form.attachments && form.attachments.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  {form.attachments.length} file(s) selected
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Assign Homework
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignHomeworkForm;