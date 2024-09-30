import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { 
  Box, Typography, List, ListItem, ListItemText, 
  Avatar, CircularProgress, TextField, useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';

const StudentList = ({ courseId }) => {
  const theme = useTheme();
  const { getEnrolledStudents } = useGlobal();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const enrolledStudents = await getEnrolledStudents(courseId);
        setStudents(enrolledStudents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students. Please try again later.');
        setLoading(false);
      }
    }
    fetchStudents();
  }, [courseId, getEnrolledStudents]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" gutterBottom>Enrolled Students</Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          label="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {filteredStudents.map(student => (
              <ListItem key={student._id} divider>
                <Avatar sx={{ mr: 2 }}>{student.name[0]}</Avatar>
                <ListItemText 
                  primary={student.name}
                  secondary={`Email: ${student.email}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <Typography>No students found.</Typography>
        )}
      </motion.div>
    </Box>
  );
};

export default StudentList;