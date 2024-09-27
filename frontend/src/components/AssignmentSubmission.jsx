import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useParams } from 'react-router-dom';

const AssignmentSubmission = () => {
  const { assignments, fetchAssignments, submitAssignment } = useGlobal();
  const { assignmentId } = useParams();
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');

  useEffect(() => {
    fetchAssignments().then(() => {
        if (assignments.length > 0 && assignmentId) {
            const assignment = assignments.find(assignment => assignment._id === assignmentId);
            if (assignment) {
              setSelectedAssignment(assignment._id);
            }
          }
    });
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitAssignment({ assignmentId: selectedAssignment, content: submissionContent });
      alert('Submission successful!');
      setSubmissionContent('');
      setSelectedAssignment('');
    } catch (error) {
      console.error('Error submitting assignment', error);
      alert('Failed to submit assignment.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Submit Assignment</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label htmlFor="assignment" className="block text-gray-700 text-sm font-bold mb-2">
            Select Assignment
          </label>
          <select
            id="assignment"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="block w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Choose an assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Submission Content
          </label>
          <textarea
            id="content"
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
            rows="5"
            className="block w-full border border-gray-300 rounded p-2"
            placeholder="Enter your assignment content here..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AssignmentSubmission;
