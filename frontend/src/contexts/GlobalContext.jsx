import React, { createContext, useState, useContext } from 'react';
import apiService from '../services/api';
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
    
  const fetchCourses = async () => {
    try {
      const response = await apiService.fetchCourses();
      console.log("fetched the api")
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

  const createCourse = async (courseData) => {
    try {
      const response = await apiService.createCourse(courseData);
      setCourses([...courses, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  };

  const updateCourse = async (courseId, courseData) => {
    try {
      const response = await apiService.updateCourse(courseId, courseData);
      await fetchCourses();
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await apiService.deleteCourse(courseId);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      const response = await apiService.enrollInCourse(courseId);
      return response.data;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  const getEnrolledStudents = async (courseId) => {
    try {
      const response = await apiService.getEnrolledStudents(courseId);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      throw error;
    }
  };


  const fetchAssignments = async () => {
    try {
      const response = await apiService.fetchAssignments();
      console.log(response.data);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  };

  const createAssignment = async (assignmentData) => {
    try {
      const response = await apiService.createAssignment(assignmentData);
      console.log(response.data);
      setAssignments([...assignments, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  };

  const updateAssignment = async (assignmentId, assignmentData) => {
    try {
      const response = await apiService.updateAssignment(assignmentId, assignmentData);
      setAssignments(assignments.map(assignment => assignment._id === assignmentId ? response.data : assignment));
      return response.data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  };

  const deleteAssignment = async (assignmentId) => {
    console.log("inside delete")
    try {
      await apiService.deleteAssignment(assignmentId);
      setAssignments(assignments.filter(assignment => assignment._id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  };

  const getAssignmentsForCourse = async (courseId) => {
    try {
      const response = await apiService.getAssignmentsForCourse(courseId);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments for course:', error);
      throw error;
    }
  };
  const fetchSubmissions = async () => {
    try {
      const response = await apiService.fetchSubmissions();
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  };

  const submitAssignment = async (submissionData) => {
    try {
      const response = await apiService.submitAssignment(submissionData);
      setSubmissions([...submissions, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  };

  const gradeSubmission = async (submissionId, gradeData) => {
    try {
      const response = await apiService.gradeSubmission(submissionId, gradeData);
      setSubmissions(submissions.map(submission => submission._id === submissionId ? response.data : submission));
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw error;
    }
  };

  const getSubmissionsForAssignment = async (assignmentId) => {
    try {
      const response = await apiService.getSubmissionsForAssignment(assignmentId);
      setSubmissions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions for assignment:', error);
      throw error;
    }
  };

  const getSubmissionsForStudent = async (studentId) => {
    try {
      const response = await apiService.getSubmissionsForStudent(studentId);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions for student:', error);
      throw error;
    }
  };
  const fetchCourseCompletionRates = async () => {
    try {
      const response = await apiService.fetchCourseCompletionRates();
      return response.data;
    } catch (error) {
      console.error('Error fetching course completion rates:', error);
      throw error;
    }
  };

  const fetchAverageGradesPerCourse = async () => {
    try {
      const response = await apiService.fetchAverageGradesPerCourse();
      return response.data;
    } catch (error) {
      console.error('Error fetching average grades per course:', error);
      throw error;
    }
  };

  const fetchStudentsPerTeacher = async () => {
    try {
     const response = await apiService.fetchStudentsPerTeacher();
      setAnalyticsData(prev => ({ ...prev, studentsPerTeacher: response.data }));
      return response.data;
    } catch (error) {
      console.error('Error fetching students per teacher:', error);
      throw error;
    }
  };

  const fetchAssignmentSubmissionRate = async () => {
    try {
      const response = await apiService.fetchAssignmentSubmissionRate();
      setAnalyticsData(prev => ({ ...prev, assignmentSubmissionRate: response.data }));
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment submission rate:', error);
      throw error;
    }
  };

  const fetchTopPerformingStudents = async () => {
    try {
      const response = await apiService.fetchTopPerformingStudents();
      setAnalyticsData(prev => ({ ...prev, topPerformingStudents: response.data }));
      return response.data;
    } catch (error) {
      console.error('Error fetching top performing students:', error);
      throw error;
    }
  };

  const fetchCoursePopularity = async () => {
    try {
      const response = await apiService.fetchCoursePopularity();
      setAnalyticsData(prev => ({ ...prev, coursePopularity: response.data }));
      return response.data;
    } catch (error) {
      console.error('Error fetching course popularity:', error);
      throw error;
    }
  };


  return (
    <GlobalContext.Provider value={{ 
      courses, 
      fetchCourses, 
      createCourse, 
      updateCourse, 
      deleteCourse,
      enrollInCourse, 
      getEnrolledStudents,
      assignments, 
      fetchAssignments, 
      createAssignment, 
      updateAssignment, 
      deleteAssignment, 
      getAssignmentsForCourse,
      submissions, 
      fetchSubmissions, 
      submitAssignment, 
      gradeSubmission, 
      getSubmissionsForAssignment, 
      getSubmissionsForStudent, 
      analyticsData,
      fetchCourseCompletionRates,
      fetchAverageGradesPerCourse,
      fetchStudentsPerTeacher,
      fetchAssignmentSubmissionRate,
      fetchTopPerformingStudents,
      fetchCoursePopularity

    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);