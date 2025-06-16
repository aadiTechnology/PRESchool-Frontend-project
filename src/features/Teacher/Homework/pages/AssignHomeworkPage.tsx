import React, { useState, useEffect } from 'react';
import AssignHomeworkForm, { AssignHomeworkFormValues, SubjectOption } from '../components/AssignHomeworkForm';
import { assignHomework } from '../services/assignHomeworkService';
import { fetchSubjectsForClass } from '../services/subjectService';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';

const AssignHomeworkPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(true);

  // Get teacher's divisionId from user info (localStorage)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const divisionId = user.divisionId || '';
  const classId = user.classId || '';

  useEffect(() => {
    async function fetchSubjects() {
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
    }
    fetchSubjects();
  }, [divisionId]);

  const handleSubmit = async (data: AssignHomeworkFormValues) => {
    setLoading(true);
    try {
      await assignHomework({
        ...data,
        divisionId,
      });
      setSnackbar({open: true, message: 'Homework assigned successfully.', severity: 'success'});
    } catch (error: any) {
      setSnackbar({open: true, message: error?.message || 'Error assigning homework.', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  if (fetchingSubjects) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh"><CircularProgress /></Box>;
  }

  return (
    <>
      <AssignHomeworkForm
        subjects={subjects}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default AssignHomeworkPage;