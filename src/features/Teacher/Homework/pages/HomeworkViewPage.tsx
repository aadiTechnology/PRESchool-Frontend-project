import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Link, Button, CircularProgress } from '@mui/material';
import { fetchHomeworkById } from '../services/HomeworkService';

const HomeworkViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [homework, setHomework] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (id !== undefined) {
          const data = await fetchHomeworkById(id);
          setHomework(data);
        } else {
          setHomework(null);
        }
      } catch {
        setHomework(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Get user role to determine navigation path
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role; // 2 = teacher, 3 = parent

  const handleBack = () => {
    if (userRole === 2) {
      navigate('/teacher/homework');
    } else if (userRole === 3) {
      navigate('/parent/homework');
    } else {
      navigate('/');
    }
  };

  return (
    <Box p={4}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h4" gutterBottom>Homework Details</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh"><CircularProgress /></Box>
      ) : !homework ? (
        <Typography color="error" mt={4}>Homework not found.</Typography>
      ) : (
        <>
          <Typography variant="h6" mt={2}>Subject</Typography>
          <Typography>{homework.subjectName}</Typography>
          <Typography variant="h6" mt={2}>Instructions</Typography>
          <Typography>{homework.instructions}</Typography>
          <Typography variant="h6" mt={2}>Attachments</Typography>
          {homework.attachments && homework.attachments.length > 0 ? (
            homework.attachments.map((att: any) => (
              <Paper key={att.name || att} sx={{ p: 2, my: 1, display: 'flex', alignItems: 'center' }}>
                <Link href={homework.baseUrl + att} target="_blank" rel="noopener">
                  {typeof att === 'string' ? att.substring(11) : att.name?.substring(11) || ''}
                </Link>
              </Paper>
            ))
          ) : (
            <Typography>No attachments</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default HomeworkViewPage;