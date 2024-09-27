import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayoutBranding from './components/DashboardLayoutBranding';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import AdminCourseManagement from './components/AdminCourseManangement';
import AssignmentList from './components/AssignmentList';
import SubmissionList from './components/SubmissionList';
import CourseCard from './components/CourseCard';
import AssignmentSubmission from './components/AssignmentSubmission';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher/courses/:courseId" element={<TeacherDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/:courseId" element={<AssignmentList />} />
      <Route path="/assignments/submissions/:assignmentId" element={<SubmissionList />} />
      <Route path="/students/courses" element={<CourseCard />} />
      <Route path="/students/assignment/:assignmentId" element={<AssignmentSubmission />} />
      <Route path="/admin" element={<AdminCourseManagement />} />
      <Route>
        <Route path="/dashboard" element={<DashboardLayoutBranding />} />
      </Route>
  </Routes>
  );
}

export default App;