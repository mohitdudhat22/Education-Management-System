// src/components/CourseCompletionChart.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchCourseCompletionRates } from '../services/analyticsService';
import { handleApiError } from '../utils/errorHandler';

const CourseCompletionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const courseCompletionData = await fetchCourseCompletionRates();
      setData(courseCompletionData);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="courseName" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="completionRate" fill="#8884d8" />
    </BarChart>
  );
};

export default CourseCompletionChart;