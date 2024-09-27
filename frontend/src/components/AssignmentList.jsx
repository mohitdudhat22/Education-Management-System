import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useParams, useNavigate } from 'react-router-dom';

const AssignmentList = () => {
  const { courseId } = useParams();
  const { courses, createAssignment, deleteAssignment, updateAssignment, fetchAssignments, fetchCourses, assignments } = useGlobal();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    courseId: courseId,
  });

  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      updateAssignment(initialData._id, { ...formData, courseId });
    } else {
      createAssignment(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      courseId: courseId,
    });
    setInitialData(null); 
  };

  const handleEdit = (assignment) => {
    setInitialData(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
      courseId: assignment.course._id,
    });
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(assignmentId);
    }
  };

  return (
    <div>
      <h1>Manage Assignments for Course ID: {courseId}</h1>
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          {initialData ? 'Update Assignment' : 'Create Assignment'}
        </button>
      </form>

      <h2 className="mt-6">Existing Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id} className="flex justify-between items-center border-b py-2">
            <span>{assignment.title}</span>
            <div>
              <button 
                onClick={() => handleEdit(assignment)} 
                className="text-yellow-500 hover:underline mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(assignment._id)} 
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
              <button 
                onClick={() => navigate(`/assignments/submissions/${assignment._id}`)}
                className="text-blue-500 hover:underline ml-2"
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;