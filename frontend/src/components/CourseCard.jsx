import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { 
  Box, Typography, Button, Card, CardContent, CardActions, 
  Grid, CircularProgress, useTheme, Snackbar, Alert 
} from '@mui/material';
import { motion } from 'framer-motion';

const CourseCard = () => {
  const theme = useTheme();
  const { courses, fetchCourses, enrollInCourse } = useGlobal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCourses()
      .then(() => setLoading(false))
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      });
  }, [fetchCourses]);

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      setSnackbar({ open: true, message: 'Successfully enrolled in the course!', severity: 'success' });
    } catch (error) {
      console.error('Error enrolling in course', error);
      setSnackbar({ open: true, message: 'Failed to enroll in the course.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom>Available Courses</Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleEnroll(course._id)}>
                        Enroll
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center">No courses available.</Typography>
              </Grid>
            )}
          </Grid>
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

export default CourseCard;