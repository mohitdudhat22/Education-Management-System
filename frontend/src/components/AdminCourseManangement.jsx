import React, { useState, useEffect } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  useTheme, 
  MenuItem 
} from '@mui/material';
import { motion } from 'framer-motion';

const AdminCourseManagement = () => {
  const theme = useTheme();
  const { 
    fetchCourses, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    getAllTeachers, 
    teacherData,
    courses 
  } = useGlobal();

  const [courseData, setCourseData] = useState({ title: '', description: '', teacherId: '' });
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    fetchCourses();
    getAllTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateCourse(courseData._id, courseData);
    } else {
      await createCourse(courseData);
    }
    setCourseData({ title: '', description: '', teacherId: '' });
    setEditMode(false);
  };

  const handleEdit = (course) => {
    setCourseData({
      _id: course._id,
      title: course.title,
      description: course.description,
      teacherId: course.teacher._id,
    });
    setEditMode(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3, bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Management
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Course Title"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Select Teacher"
                    value={courseData.teacherId}
                    onChange={(e) => setCourseData({ ...courseData, teacherId: e.target.value })}
                    required
                    fullWidth
                  >
                    {teacherData.map((teacher) => (
                      <MenuItem key={teacher._id} value={teacher._id}>
                        {teacher.fullName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Course Description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    required
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {editMode ? 'Update Course' : 'Create Course'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Existing Courses
        </Typography>
        <Grid container spacing={2}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Teacher: {course.teacher.fullName}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button onClick={() => handleEdit(course)} color="primary" sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(course._id)} color="error">
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default AdminCourseManagement;