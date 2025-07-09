const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/category'); 
const Career = require('../models/careers');    

exports.getDashboardCounts = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: { $ne: 'admin' } });

    const categoryWorkshopCount = await Category.countDocuments({ category: 'workShop' });
    const categoryInternshipCount = await Category.countDocuments({ category: 'internShip' });


    const courseCount = await Course.countDocuments();

    const carrierCount = await Career.countDocuments({ status: 'Active' });

    res.status(200).json({
      userCount,
      categoryWorkshopCount,
      categoryInternshipCount,
      courseCount,
      carrierCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard counts', error: error.message });
  }
};
