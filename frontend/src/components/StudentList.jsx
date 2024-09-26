import React, { useEffect, useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';

const StudentList = ({ courseId }) => {
  const { getEnrolledStudents } = useGlobal();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const enrolledStudents = await getEnrolledStudents(courseId);
      setStudents(enrolledStudents);
    }
    fetchStudents();
  }, [courseId, getEnrolledStudents]);

  return (
    <ul>
      {students.map(student => (
        <li key={student._id}>{student.name}</li>
      ))}
    </ul>
  );
};

export default StudentList;
