import { useGlobal } from '../context/GlobalContext';
import { useEffect } from 'react';
const CourseList = () => {
  const { courses, fetchCourses } = useGlobal();

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course._id}>{course.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
