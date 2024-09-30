import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Button, CircularProgress, 
  useTheme, Snackbar, Alert 
} from '@mui/material';
import { motion } from 'framer-motion';

const SubmissionList = () => {
  const theme = useTheme();
  const { submissions, getSubmissionsForAssignment, gradeSubmission } = useGlobal();
  const { assignmentId } = useParams();
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      await getSubmissionsForAssignment(assignmentId);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions. Please try again later.');
      setLoading(false);
    }
  };

  const handleGradeChange = (submissionId, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [submissionId]: value,
    }));
  };

  const handleGradeSubmit = async (submissionId) => {
    const grade = grades[submissionId];
    try {
      await gradeSubmission(submissionId, { grade });
      setSnackbar({ open: true, message: 'Graded successfully!', severity: 'success' });
      setGrades((prevGrades) => ({ ...prevGrades, [submissionId]: '' }));
    } catch (error) {
      console.error('Error grading submission', error);
      setSnackbar({ open: true, message: 'Failed to grade submission.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" gutterBottom>Submissions for Assignment ID: {assignmentId}</Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Submission Content</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Existing Grade</TableCell>
                  <TableCell>New Grade</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell>{submission.student._id}</TableCell>
                      <TableCell>{submission.content}</TableCell>
                      <TableCell>{new Date(submission.submissionDate).toLocaleString()}</TableCell>
                      <TableCell>{submission.grade !== undefined ? submission.grade : 'N/A'}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          inputProps={{ min: 0, max: 10 }}
                          value={grades[submission._id] || ''}
                          onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleGradeSubmit(submission._id)}
                          disabled={!grades[submission._id]}
                        >
                          Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No submissions available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubmissionList;