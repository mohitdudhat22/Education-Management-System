import { Bar } from 'react-chartjs-2';
import { useGlobal } from '../../context/GlobalContext';

const AnalyticsDashboard = () => {
  const { fetchCourseCompletionRates, fetchAverageGradesPerCourse } = useGlobal();
  const [completionRates, setCompletionRates] = useState([]);
  const [averageGrades, setAverageGrades] = useState([]);

  useEffect(() => {
    fetchCourseCompletionRates().then(setCompletionRates);
    fetchAverageGradesPerCourse().then(setAverageGrades);
  }, []);

  const completionRateData = {
    labels: completionRates.map(course => course.name),
    datasets: [
      {
        label: 'Completion Rate',
        data: completionRates.map(course => course.completionRate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const averageGradeData = {
    labels: averageGrades.map(course => course.name),
    datasets: [
      {
        label: 'Average Grade',
        data: averageGrades.map(course => course.averageGrade),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>Course Completion Rates</h2>
      <Bar data={completionRateData} />
      <h2>Average Grades</h2>
      <Bar data={averageGradeData} />
    </div>
  );
};

export default AnalyticsDashboard;
