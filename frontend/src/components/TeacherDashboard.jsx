import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { courseId } = useParams();
  const {
    courses,
    fetchCourses,
    getAssignmentsForCourse,
    getEnrolledStudents,
    getSubmissionsForAssignment,
  } = useGlobal();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    const assignmentsData = await getAssignmentsForCourse(course._id);
    setAssignments(assignmentsData);
    const studentsData = await getEnrolledStudents(course._id);
    console.log(studentsData);
    console.log(assignments);
    setStudents(studentsData);
    setSubmissions([]);
  };
  console.log(courses);
  console.log(user);
  const handleViewSubmissions = async (assignmentId) => {
    const submissionsData = await getSubmissionsForAssignment(assignmentId);
    setSubmissions(submissionsData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Teacher Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Your Courses
                </Typography>
                <List>
                  {courses.map((course) => {
                    if (course.teacher._id === user._id) {
                      return (
                        <ListItem
                          key={course._id}
                          button
                          onClick={() => handleCourseSelect(course)}
                        >
                          <ListItemText
                            primary={course.title}
                            secondary={course.description}
                          />
                        </ListItem>
                      );
                    }
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
          {selectedCourse && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Course Details: {selectedCourse.title}
                  </Typography>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Assignments
                  </Typography>
                  <List>
                    {Array.isArray(assignments) &&
                      assignments.length !== 0 &&
                      assignments.map((assignment) => (
                        <ListItem key={assignment?._id}>
                          <ListItemText
                            primary={assignment?.title}
                            secondary={`Due: ${new Date(assignment?.dueDate).toLocaleDateString()}`}
                          />
                          <Button
                            onClick={() =>
                              handleViewSubmissions(assignment?._id)
                            }
                          >
                            View Submissions
                          </Button>
                        </ListItem>
                      ))}
                  </List>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Enrolled Students
                  </Typography>
                  <List>
                    {students.map((student) => (
                      <ListItem key={student._id}>
                        <ListItemText
                          primary={student.fullName}
                          secondary={student.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
          {submissions.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Submissions
                  </Typography>
                  <List>
                    {submissions.map((submission) => (
                      <ListItem key={submission._id}>
                        <ListItemText
                          primary={`${submission.student.fullName} - ${submission.assignment.title}`}
                          secondary={`Submitted: ${new Date(submission.submissionDate).toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default TeacherDashboard;
