import React from 'react';
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
import { useForm, Controller } from 'react-hook-form';

export interface SubjectOption {
  id: number;
  name: string;
}

export interface AssignHomeworkFormValues {
  classId: number;
  subjectId: number | '';
  homeworkDate: string;
  instructions: string;
  attachments: File[];
}

interface Props {
  classId: number;
  subjects: SubjectOption[];
  onSubmit: (data: AssignHomeworkFormValues) => void;
  loading?: boolean;
}

const AssignHomeworkForm: React.FC<Props> = ({
  classId,
  subjects,
  onSubmit,
  loading,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<AssignHomeworkFormValues>({
    defaultValues: {
      subjectId: '',
      homeworkDate: '',
      instructions: '',
      attachments: [],
    },
    mode: 'onBlur',
  });

  // Custom validation for required fields
  const validateNotEmpty = (value: any) =>
    value !== undefined && value !== null && value !== '' ? true : 'This field is required';

  const attachments = watch('attachments');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue('attachments', Array.from(e.target.files));
      trigger('attachments');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assign Homework
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Share instructions and upload files for your class
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Controller
              name="subjectId"
              control={control}
              rules={{ validate: validateNotEmpty }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Subject"
                  displayEmpty
                  value={field.value === undefined ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Please select subject</em>
                  </MenuItem>
                  {subjects.map((subj) => (
                    <MenuItem key={subj.id} value={subj.id}>
                      {subj.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Typography color="error" variant="caption">
              {errors.subjectId?.message}
            </Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="homeworkDate"
            control={control}
            rules={{ validate: validateNotEmpty }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Homework Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Select date"
                error={!!errors.homeworkDate}
                helperText={errors.homeworkDate?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="instructions"
            control={control}
            rules={{ validate: validateNotEmpty }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Instructions"
                placeholder="Enter instructions"
                fullWidth
                multiline
                minRows={4}
                error={!!errors.instructions}
                helperText={errors.instructions?.message}
              />
            )}
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
            {attachments && attachments.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  {attachments.length} file(s) selected
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