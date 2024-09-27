import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseList from './CourseList';
import AssignmentList from './AssignmentList';
import StudentList from './StudentList';
import SubmissionList from './SubmissionList';
import { useGlobal } from '../contexts/GlobalContext';

const TeacherDashboard = () => {
  const { courses, fetchCourses, getAssignmentsForCourse, submissions } = useGlobal();
  const { courseId } = useParams();

  useEffect(() => {
    fetchCourses();
    if (courseId) {
      getAssignmentsForCourse(courseId);
    }
  }, []);

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <div className="dashboard-section">
        <h2>Courses</h2>
        <CourseList courses={courses} />
      </div>

      {courseId && (
        <>
          <div className="dashboard-section">
            <h2>Assignments</h2>
            <AssignmentList courseId={courseId} />
          </div>

          <div className="dashboard-section">
            <h2>Enrolled Students</h2>
            <StudentList courseId={courseId} />
          </div>

          <div className="dashboard-section">
            <h2>Submissions</h2>
            <SubmissionList courseId={courseId} />
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
