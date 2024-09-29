import React, { useState, useEffect } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { Grid, Typography, TextField, Button, Card, CardContent, MenuItem } from '@material-ui/core';
import { motion } from 'framer-motion';
import CourseList from './CourseList';

const AdminCourseManagement = () => {
  const {
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllTeachers,
    teacherData
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" component="h2" gutterBottom>
            Course Management
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Course Title"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Course Description"
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disableElevation
                    >
                      {editMode ? 'Update Course' : 'Create Course'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" component="h3" gutterBottom>
            Existing Courses
          </Typography>
          <CourseList handleEdit={handleEdit} handleDelete={handleDelete} />
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default AdminCourseManagement;
