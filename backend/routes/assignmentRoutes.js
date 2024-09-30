import express from 'express';
import Course from '../models/courseModel.js';
import Assignment from '../models/assignmentModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// Create a new assignment (Teacher only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only teachers can create assignments' });
    }
    const course = await Course.findById(req.body.courseId);
    console.log(course);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You can only create assignments for courses you teach' });
    }
    const assignment = new Assignment({
      ...req.body,
      course: req.body.courseId
    });
    await assignment.save();
    res.status(201).send(assignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all assignments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.find({}).populate('course', 'title');
    res.send(assignments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get assignments for a specific course
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId }).populate('course', 'title');
    res.send({assignments});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

// Get a specific assignment
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course', 'title');
    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }
    res.send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an assignment (Teacher only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only teachers can update assignments' });
    }
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }
    const course = await Course.findById(assignment.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You can only update assignments for courses you teach' });
    }
    Object.assign(assignment, req.body);
    await assignment.save();
    res.send(assignment);
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

// Delete an assignment (Teacher only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).send({ error: 'Only teachers can delete assignments' });
    }
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }
    const course = await Course.findById(assignment.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You can only delete assignments for courses you teach' });
    }
    const deletedAssignment = await Assignment.deleteOne({ _id: req.params.id });
    res.send({deletedAssignment , message: 'Assignment deleted successfully'});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});



export default router;