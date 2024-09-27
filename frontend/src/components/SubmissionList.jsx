import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useParams } from 'react-router-dom';

const SubmissionList = () => {
  const { submissions, getSubmissionsForAssignment, gradeSubmission } = useGlobal();
  const { assignmentId } = useParams(); // Get assignmentId from URL parameters

  // State to hold grades for each submission
  const [grades, setGrades] = useState({});

  useEffect(() => {
    if (assignmentId) {
      getSubmissionsForAssignment(assignmentId); // Use assignmentId to fetch submissions
    }
  }, []);

  const handleGradeChange = (submissionId, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [submissionId]: value,
    }));
  };

  const handleGradeSubmit = async (submissionId) => {
    const grade = grades[submissionId]; // Get the grade for this submission
    try {
      await gradeSubmission(submissionId, { grade });
      alert('Graded successfully!');
      // Optionally clear the grade input after successful submission
      setGrades((prevGrades) => ({ ...prevGrades, [submissionId]: '' }));
    } catch (error) {
      console.error('Error grading submission', error);
      alert('Failed to grade submission.');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Submissions for Assignment ID: {assignmentId}</h1>
      <table className="min-w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Student ID</th>
            <th className="border border-gray-300 px-4 py-2">Submission Content</th>
            <th className="border border-gray-300 px-4 py-2">Submission Date</th>
            <th className="border border-gray-300 px-4 py-2">Existing Grade</th>
            <th className="border border-gray-300 px-4 py-2">Grade (Out of 10)</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{submission.student._id}</td>
                <td className="border border-gray-300 px-4 py-2">{submission.content}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(submission.submissionDate).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {submission.grade !== undefined ? submission.grade : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Grade"
                    value={grades[submission._id] || ''}
                    onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                    className="w-20 p-1 border border-gray-300 rounded-md"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleGradeSubmit(submission._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    Add Grade
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                No submissions available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;
