import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayoutBranding from './components/DashboardLayoutBranding';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherDashboard from './components/TeacherDashboard';
import AdminCourseManagement from './components/AdminCourseManangement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher/courses/:courseId" element={<TeacherDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/admin" element={<AdminCourseManagement />} />
      <Route>
        <Route path="/dashboard" element={<DashboardLayoutBranding />} />
      </Route>
  </Routes>
  );
}

export default App;