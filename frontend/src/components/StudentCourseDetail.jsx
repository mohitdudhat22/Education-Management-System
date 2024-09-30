import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';
import { 
  Box, Typography, Button, Card, CardContent, Grid, TextField, 
  List, ListItem, ListItemText, useTheme, Paper, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const StudentCourseDetail = () => {
  const theme = useTheme();
  const { courseId } = useParams();
  const { enrollInCourse, submitAssignment, getAssignmentsForCourse, getSubmissionsForStudent, courses } = useGlobal();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submissionContent, setSubmissionContent] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    if (courseId) {
      const selectedCourse = courses.find(c => c._id === courseId);
      setCourse(selectedCourse);
      loadCourseData();
    }
  }, [courseId, courses]);

  const loadCourseData = async () => {
    try {
      const assignmentsData = await getAssignmentsForCourse(courseId);
      setAssignments(assignmentsData);
      const submissionsData = await getSubmissionsForStudent();
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading course data', error);
      toast.error('Failed to load course data.');
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollInCourse(courseId);
      toast.success('Successfully enrolled in the course!');
      loadCourseData();
    } catch (error) {
      console.error('Error enrolling in course', error);
      toast.error('Failed to enroll in the course.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) {
      toast.error('Please select an assignment');
      return;
    }
    try {
      await submitAssignment({ assignmentId: selectedAssignment._id, content: submissionContent });
      toast.success('Assignment submitted successfully!');
      setSubmissionContent('');
      setSelectedAssignment(null);
      loadCourseData();
    } catch (error) {
      console.error('Error submitting assignment', error);
      toast.error('Failed to submit assignment.');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
      <motion.div {...fadeInUp}>
        <Typography variant="h4" gutterBottom>
          Course Details: {course?.title}
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div {...fadeInUp}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Course Information</Typography>
              <Typography variant="body1">{course?.description}</Typography>
              {!course?.enrolled && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEnroll}
                  sx={{ mt: 2 }}
                >
                  Enroll in Course
                </Button>
              )}
            </Paper>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Assignments</Typography>
              <List>
                {assignments.map((assignment) => (
                  <ListItem
                    key={assignment._id}
                    button
                    onClick={() => setSelectedAssignment(assignment)}
                    selected={selectedAssignment?._id === assignment._id}
                  >
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div {...fadeInUp}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Submit Assignment</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="Enter your submission here"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!selectedAssignment || !submissionContent.trim()}
              >
                Submit Assignment
              </Button>
            </Paper>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>Your Submissions</Typography>
              <List>
                {submissions.map((submission) => (
                  <ListItem key={submission._id}>
                    <ListItemText
                      primary={submission.assignment.title}
                      secondary={`Submitted: ${new Date(submission.submittedAt).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentCourseDetail;