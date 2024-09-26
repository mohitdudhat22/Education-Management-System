import express from 'express';
import Course from '../models/courseModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import pkg from 'winston';
const { log } = pkg;
const router = express.Router();

// Create a new course (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log(req.user.role)
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can create courses' });
    }
    const course = new Course({
      ...req.body,
      teacher: req.body.teacherId
    });
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher', 'name');
    res.send(courses);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific course
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name').populate('students', 'name');
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a course (Admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    console.log(req.user.role)
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can update courses' });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {new : true});
    await course.save();
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send({course, message: 'Course updated successfully'});
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

// Delete a course (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can delete courses' });
    }
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Enroll a student in a course
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).send({ error: 'Only students can enroll in courses' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    if (course.students.includes(req.user._id)) {
      return res.status(400).send({ error: 'Student already enrolled in this course' });
    }
    course.students.push(req.user._id);
    await course.save();
    res.send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get enrolled students for a course (Teacher and Admin only)
router.get('/:id/students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only teachers and admins can view enrolled students' });
    }
    const course = await Course.findById(req.params.id).populate('students', 'name email');
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course.students);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router