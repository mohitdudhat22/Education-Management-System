import React, { useEffect } from 'react';
import { useGlobal } from '../contexts/GlobalContext';

const CourseCard = () => {
  const { courses, fetchCourses, enrollInCourse } = useGlobal(); // Assume these are provided by your context

  useEffect(() => {
    fetchCourses(); // Fetch the list of courses on component mount
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId); // Enroll the student in the selected course
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course', error);
      alert('Failed to enroll in the course.');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <h1 className="text-xl font-semibold col-span-full">Available Courses</h1>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course._id} className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-lg font-bold">{course.title}</h2>
            <p className="mt-2 text-gray-700">{course.description}</p>
            <div className="mt-4">
              <button
                onClick={() => handleEnroll(course._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                Enroll
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center">
          <p>No courses available.</p>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
