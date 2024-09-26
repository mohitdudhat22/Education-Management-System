import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';

const AssignmentList = ({ courseId }) => {
  const { assignments, getAssignmentsForCourse, createAssignment } = useGlobal();
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });

  useEffect(() => {
    if (courseId) {
      getAssignmentsForCourse(courseId);
    }
  }, [courseId, getAssignmentsForCourse]);

  const handleCreateAssignment = async () => {
    if (newAssignment.title && newAssignment.description) {
      await createAssignment({ ...newAssignment, courseId });
      setNewAssignment({ title: '', description: '' });
    }
  };

  return (
    <div>
      <h3>Assignments</h3>
      <ul className="border border-gray-300 rounded-lg">
        {assignments.map(assignment => (
          <li key={assignment._id} className="p-2 border-b">
            {assignment.title}
          </li>
        ))}
      </ul>
      <h3>Create New Assignment</h3>
      <input
        type="text"
        placeholder="Assignment Title"
        value={newAssignment.title}
        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
        className="border rounded p-2"
      />
      <textarea
        placeholder="Assignment Description"
        value={newAssignment.description}
        onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
        className="border rounded p-2"
      />
      <button onClick={handleCreateAssignment} className="bg-blue-500 text-white p-2 rounded">Create Assignment</button>
    </div>
  );
};

export default AssignmentList;
