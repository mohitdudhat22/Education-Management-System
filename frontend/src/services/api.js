import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  // Courses
  fetchCourses: () => api.get('/api/courses'),
  createCourse: (courseData) => api.post('/api/courses', courseData),
  updateCourse: (courseId, courseData) => api.patch(`/api/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/api/courses/${courseId}`),
  enrollInCourse: (courseId) => api.post(`/api/courses/${courseId}/enroll`),
  getEnrolledStudents: (courseId) => api.get(`/api/courses/${courseId}/students`),
  getAllTeachers: () => api.get(`/api/courses/getAllTeachers`),

  // Assignments
  fetchAssignments: () => api.get('/api/assignments'),
  createAssignment: (assignmentData) => api.post('/api/assignments', assignmentData),
  updateAssignment: (assignmentId, assignmentData) => api.patch(`/api/assignments/${assignmentId}`, assignmentData),
  deleteAssignment: (assignmentId) => api.delete(`/api/assignments/${assignmentId}`),
  getAssignmentsForCourse: (courseId) => api.get(`/api/assignments/course/${courseId}`),

  // Submissions
  fetchSubmissions: () => api.get('/api/submissions'),
  submitAssignment: (submissionData) => api.post('/api/submissions', submissionData),
  gradeSubmission: (submissionId, gradeData) => api.patch(`/api/submissions/${submissionId}/grade`, gradeData),
  getSubmissionsForAssignment: (assignmentId) => api.get(`/api/submissions/assignment/${assignmentId}`),
  getSubmissionsForStudent: (studentId) => api.get(`/api/submissions/student/${studentId}`),

  // Analytics
  getCourseCompletionRates: () => api.get('/api/analytics/course-completion'),
  getAverageGradesPerCourse: () => api.get('/api/analytics/average-grades'),
  getStudentsPerTeacher: () => api.get('/api/analytics/students-per-teacher'),
  getAssignmentSubmissionRate: () => api.get('/api/analytics/assignment-submission-rate'),
  getTopPerformingStudents: () => api.get('/api/analytics/top-students'),
  getCoursePopularity: () => api.get('/api/analytics/course-popularity'),

  //Auth
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  fetchUserProfile: () => api.get('/api/users/profile'),
};

export default apiService;