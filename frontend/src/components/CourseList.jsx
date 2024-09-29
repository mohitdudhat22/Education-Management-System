import React from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CourseList = ({ handleEdit, handleDelete }) => {
  const { courses, getEnrolledStudents } = useGlobal();
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleCourseClick = (id) => {
    navigate(`/teacher/${id}`); // Navigate to the course page
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Course Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Teacher ID</th>
            <th className="py-2 px-4 border-b">Enrolled Students</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id} className="border-b">
              <td 
                className="py-2 px-4 text-blue-500 cursor-pointer hover:underline"
                onClick={() => handleCourseClick(course._id)} // Add click handler for course title
              >
                {course.title}
              </td>
              <td className="py-2 px-4">{course.description}</td>
              <td className="py-2 px-4">{course.teacher._id}</td>
              <td className="py-2 px-4">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => getEnrolledStudents(course._id)}
                >
                  {course.students.length} Students
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  className="text-yellow-500 hover:underline mr-2"
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
