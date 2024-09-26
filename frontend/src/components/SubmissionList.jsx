import React, { useEffect } from 'react';
import { useGlobal } from '../contexts/GlobalContext';

const SubmissionList = ({ courseId }) => {
  const { submissions, getSubmissionsForAssignment, gradeSubmission } = useGlobal();

  useEffect(() => {
    if (courseId) {
      getSubmissionsForAssignment(courseId);
    }
  }, [courseId, getSubmissionsForAssignment]);

  const handleGrade = async (submissionId, grade) => {
    try {
      await gradeSubmission(submissionId, { grade });
      alert('Graded successfully!');
    } catch (error) {
      console.error('Error grading submission', error);
    }
  };

  return (
    <ul>
      {submissions.map(submission => (
        <li key={submission._id}>
          {submission.studentName} - {submission.assignmentTitle} 
          <input type="number" placeholder="Grade" onBlur={(e) => handleGrade(submission._id, e.target.value)} />
        </li>
      ))}
    </ul>
  );
};

export default SubmissionList;
