import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, Typography, TextField, Button, Select, MenuItem, 
  List, ListItem, ListItemText, IconButton, useTheme 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const AssignmentList = () => {
  const theme = useTheme();
  const { courseId } = useParams();
  const { courses, createAssignment, deleteAssignment, updateAssignment, fetchAssignments, fetchCourses, assignments } = useGlobal();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    courseId: courseId,
  });
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      updateAssignment(initialData._id, { ...formData, courseId });
    } else {
      createAssignment(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      courseId: courseId,
    });
    setInitialData(null); 
  };

  const handleEdit = (assignment) => {
    setInitialData(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
      courseId: assignment.course._id,
    });
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(assignmentId);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom>
          Manage Assignments for Course ID: {courseId}
        </Typography>
        
        <Box component="form" onSubmit={handleFormSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
            fullWidth
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Select
            label="Course"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="">
              <em>Select a course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {initialData ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </Box>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Existing Assignments
        </Typography>
        <List>
          {assignments.map((assignment) => (
            <ListItem
              key={assignment._id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(assignment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(assignment._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="view" onClick={() => navigate(`/assignments/submissions/${assignment._id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={assignment.title}
                secondary={`Due: ${new Date(assignment.dueDate).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </motion.div>
    </Box>
  );
};

export default AssignmentList;