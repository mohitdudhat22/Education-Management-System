import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayoutBranding from './components/DashboardLayoutBranding';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route>
        <Route path="/dashboard" element={<DashboardLayoutBranding />} />
      </Route>
  </Routes>
  );
}

export default App;