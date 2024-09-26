import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import CourseList from './CourseList';

const AdminCourseManagement = () => {
  const {
    courses,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useGlobal();

  const [courseData, setCourseData] = useState({ title: '', description: '', teacherId: '' });
  const [editMode, setEditMode] = useState(false);

  // Handle form submit for creating or updating courses
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateCourse(courseData._id, courseData); // Update existing course
    } else {
      await createCourse(courseData); // Create a new course
    }
    setCourseData({ title: '', description: '', teacherId: '' }); // Clear form
    setEditMode(false);
  };

  // Handle editing a course
  const handleEdit = (course) => {
    setCourseData({
      _id: course._id, 
      title: course.title, 
      description: course.description, 
      teacherId: course.teacher._id,
    });
    setEditMode(true);
  };

  // Handle deleting a course
  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  useEffect(() => {
    fetchCourses(); // Fetch courses on component mount
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Course Management</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Course Title"
            className="border p-2 rounded w-full"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Course Description"
            className="border p-2 rounded w-full"
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Teacher ID"
            className="border p-2 rounded w-full"
            value={courseData.teacherId}
            onChange={(e) => setCourseData({ ...courseData, teacherId: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? 'Update Course' : 'Create Course'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Existing Courses</h3>
      <CourseList handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default AdminCourseManagement;
