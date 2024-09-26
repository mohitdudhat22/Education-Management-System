import { useParams } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const StudentCourseDetail = () => {
    const { enrollInCourse, submitAssignment, getAssignmentsForCourse } = useGlobal();
    const { courseId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [submission, setSubmission] = useState('');
  
    useEffect(() => {
      getAssignmentsForCourse(courseId).then(setAssignments);
    }, [courseId]);
  
    const handleSubmit = async () => {
      await submitAssignment({ courseId, content: submission });
      toast.success('Assignment submitted!');
    };
  
    return (
      <div>
        <button onClick={() => enrollInCourse(courseId)}>Enroll in Course</button>
        <ul>
          {assignments.map(assignment => (
            <li key={assignment._id}>{assignment.title}</li>
          ))}
        </ul>
        <textarea value={submission} onChange={(e) => setSubmission(e.target.value)} />
        <button onClick={handleSubmit}>Submit Assignment</button>
      </div>
    );
  };
  