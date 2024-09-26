import express from 'express';
import Assignment from '../models/assignmentModel.js';
import Course from '../models/courseModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import Submission from '../models/submissionModel.js';
const router = express.Router();

// Submit an assignment (Student only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).send({ error: 'Only students can submit assignments' });
    }
    const assignment = await Assignment.findById(req.body.assignmentId);
    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }
    const course = await Course.findById(assignment.course);
    if (!course.students.includes(req.user._id)) {
      return res.status(403).send({ error: 'You are not enrolled in this course' });
    }
    const submission = new Submission({
      assignment: req.body.assignmentId,
      student: req.user._id,
      content: req.body.content
    });
    await submission.save();
    res.status(201).send(submission);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all submissions (Teacher and Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only teachers and admins can view all submissions' });
    }
    const submissions = await Submission.find({})
      .populate('assignment', 'title')
      .populate('student', 'name');
    res.send(submissions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific submission
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('assignment', 'title')
      .populate('student', 'name');
      console.log(submission, "<><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< submission");
      console.log(req.user, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user");
    if (!submission) {
      return res.status(404).send({ error: 'Submission not found' });
    }
    if (req.user.role === 'student' && submission.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You can only view your own submissions' });
    }
    res.send({submission});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

// Grade a submission (Teacher only)
router.patch('/:id/grade', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only teachers can grade submissions' });
    }
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).send({ error: 'Submission not found' });
    }
    const assignment = await Assignment.findById(submission.assignment);
    const course = await Course.findById(assignment.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You can only grade submissions for courses you teach' });
    }
    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;
    await submission.save();
    res.send(submission);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get submissions for a specific assignment (Teacher only)
router.get('/assignment/:assignmentId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only teachers can view submissions for an assignment' });
    }
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }
    const course = await Course.findById(assignment.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You can only view submissions for courses you teach' });
    }
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name');
    res.send(submissions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get submissions for a specific student (Student and Teacher)
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).send({ error: 'You can only view your own submissions' });
    }
    const submissions = await Submission.find({ student: req.params.studentId })
      .populate('assignment', 'title')
      .populate('student', 'name');
    res.send(submissions);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;