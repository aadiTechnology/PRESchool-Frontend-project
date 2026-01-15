import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNoticeById, NoticeItem } from '../services/noticeService';
import { Box, Typography, Paper, Link, Button, CircularProgress, Alert } from '@mui/material';

const NoticeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await fetchNoticeById(Number(id));
          setNotice(data);
        }
      } catch {
        setError('Failed to fetch notice details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!notice) return <Typography>No notice found.</Typography>;

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom>{notice.title}</Typography>
      <Typography variant="subtitle1" gutterBottom>Date: {notice.date}</Typography>
      <Typography variant="body1" gutterBottom>{notice.content}</Typography>
      <Typography variant="subtitle2" mt={2}>Attachments:</Typography>
      {notice.attachments && notice.attachments.length > 0 ? (
        notice.attachments.map((file, idx) => (
          <Paper key={idx} sx={{ p: 1, my: 1, display: 'flex', alignItems: 'center' }}>
            <Link
              href={(notice.baseUrl || '') + file}
              target="_blank"
              rel="noopener"
            >
                {file && file ? file.toString().substring(11) : ''}
            </Link>
          </Paper>
        ))
      ) : (
        <Typography>No attachments</Typography>
      )}
    </Box>
  );
};

export default NoticeViewPage;