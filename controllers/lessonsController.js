const Course = require('../models/Course');
const Lesson = require('../models/lessons'); // collection where lesson content is stored

exports.createLessonsForCourse = async (req, res) => {
  try {
    const { courseId, units } = req.body;

    if (!courseId || !Array.isArray(units)) {
      return res.status(400).json({ message: 'courseId and units are required' });
    }

    // Step 1: Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Step 2: Save lesson content (with full course data inside)
    const lessonDoc = new Lesson({
      courseId: course, // embed full object
      units
    });

    const saved = await lessonDoc.save();
    res.status(201).json({ message: 'Lessons created successfully', data: saved });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get lessons by ID
exports.getLessonsById = async (req, res) => {
  try {
    const { lessonsId } = req.params;
    const lesson = await Lesson.findById(lessonsId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update lessons
exports.updateLessons = async (req, res) => {
  try {
    const { lessonsId } = req.params;
    const { courseId, units } = req.body;

    if (!courseId || !Array.isArray(units)) {
      return res.status(400).json({ message: 'courseId and units are required' });
    }

    // Step 1: Get the course object
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Step 2: Get the existing lesson document
    const lesson = await Lesson.findById(lessonsId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Step 3: Update and save
    lesson.courseId = course; // full object
    lesson.units = units;
    const updated = await lesson.save();
    console.log('Updated:', updated);
    res.json({ message: 'Lessons updated', data: updated });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete lessons
exports.deleteLessons = async (req, res) => {
  try {
    const { lessonsId } = req.params;
    const lesson = await Lesson.findByIdAndDelete(lessonsId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json({ message: 'Lessons deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
