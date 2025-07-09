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

// Get lessons by courseId
exports.getAllLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'courseId is required' 
      });
    }
    
    console.log("Searching for courseId:", courseId);
    console.log("Type of courseId:", typeof courseId);
    
    // Let's first check what courseId structures exist in the database
    const allLessons = await Lesson.find({});
    console.log("All lessons courseId structures:");
    allLessons.forEach((lesson, index) => {
      console.log(`Lesson ${index + 1}:`);
      console.log("  courseId:", lesson.courseId);
      console.log("  courseId._id:", lesson.courseId._id);
      console.log("  courseId._id type:", typeof lesson.courseId._id);
    });
    
    // Try multiple query approaches
    let lessons = null;
    
    // Approach 1: Direct string comparison
    lessons = await Lesson.findOne({ 'courseId._id': courseId });
    console.log("Approach 1 result:", lessons ? "Found" : "Not found");
    
    // Approach 2: Convert courseId to ObjectId if it's a valid ObjectId string
    if (!lessons && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      const mongoose = require('mongoose');
      const objectId = new mongoose.Types.ObjectId(courseId);
      lessons = await Lesson.findOne({ 'courseId._id': objectId });
      console.log("Approach 2 (ObjectId) result:", lessons ? "Found" : "Not found");
    }
    
    // Approach 3: String comparison if courseId._id is stored as string
    if (!lessons) {
      lessons = await Lesson.findOne({ 'courseId._id': courseId.toString() });
      console.log("Approach 3 (String) result:", lessons ? "Found" : "Not found");
    }
    
    if (!lessons) {
      return res.status(200).json({ 
        success: true, 
        message: 'No lessons found for this course', 
        data: [] 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Lessons retrieved successfully', 
      data: lessons 
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};
