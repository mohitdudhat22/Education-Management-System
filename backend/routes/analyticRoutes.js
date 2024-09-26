import express from 'express';
import Course from '../models/courseModel.js';
import Submission from '../models/submissionModel.js';
import Assignment from '../models/assignmentModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get course completion rates
router.get('/course-completion', authMiddleware, async (req, res) => {
  try {
    
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only admins and teachers can access this data' });
    }

    const courses = await Course.find({});
    const completionRates = await Promise.all(courses.map(async (course) => {
      const assignments = await Assignment.find({ course: course._id });
      const totalAssignments = assignments.length;
      const students = course.students;
      const completionData = await Promise.all(students.map(async (student) => {
        const completedAssignments = await Submission.countDocuments({
          assignment: { $in: assignments.map(a => a._id) },
          student: student,
          grade: { $exists: true }
        });
        return completedAssignments / totalAssignments;
      }));
      const averageCompletion = completionData.reduce((a, b) => a + b, 0) / completionData.length;
      return {
        courseName: course.title,
        completionRate: averageCompletion * 100
      };
    }));
    res.send(completionRates);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get average grades per course
router.get('/average-grades', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only admins and teachers can access this data' });
    }
    const averageGrades = await Course.aggregate([
      {
        $lookup: {
          from: 'assignments',
          localField: '_id',
          foreignField: 'course',
          as: 'assignments'
        }
      },
      {
        $unwind: '$assignments'
      },
      {
        $lookup: {
          from: 'submissions',
          localField: 'assignments._id',
          foreignField: 'assignment',
          as: 'submissions'
        }
      },
      {
        $unwind: '$submissions'
      },
      {
        $group: {
          _id: '$_id',
          courseName: { $first: '$title' },
          averageGrade: { $avg: '$submissions.grade' }
        }
      }
    ]);
    res.send(averageGrades);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get number of students per teacher
router.get('/students-per-teacher', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can access this data' });
    }
    const studentsPerTeacher = await Course.aggregate([
      {
        $group: {
          _id: '$teacher',
          studentCount: { $sum: { $size: '$students' } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'teacherInfo'
        }
      },
      {
        $unwind: '$teacherInfo'
      },
      {
        $project: {
          teacherName: '$teacherInfo.name',
          studentCount: 1
        }
      }
    ]);
    res.send(studentsPerTeacher);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get assignment submission rate
router.get('/assignment-submission-rate', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only admins and teachers can access this data' });
    }
    const assignments = await Assignment.find({});
    const submissionRates = await Promise.all(assignments.map(async (assignment) => {
      const course = await Course.findById(assignment.course);
      const totalStudents = course.students.length;
      const submittedCount = await Submission.countDocuments({ assignment: assignment._id });
      return {
        assignmentTitle: assignment.title,
        courseName: course.title,
        submissionRate: (submittedCount / totalStudents) * 100
      };
    }));
    res.send(submissionRates);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get top-performing students
router.get('/top-students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only admins and teachers can access this data' });
    }
    const topStudents = await Submission.aggregate([
      {
        $group: {
          _id: '$student',
          averageGrade: { $avg: '$grade' }
        }
      },
      {
        $sort: { averageGrade: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $unwind: '$studentInfo'
      },
      {
        $project: {
          studentName: '$studentInfo.name',
          averageGrade: 1
        }
      }
    ]);
    res.send(topStudents);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get course popularity
router.get('/course-popularity', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can access this data' });
    }
    const coursePopularity = await Course.aggregate([
      {
        $project: {
          title: 1,
          studentCount: { $size: '$students' }
        }
      },
      {
        $sort: { studentCount: -1 }
      }
    ]);
    res.send(coursePopularity);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;