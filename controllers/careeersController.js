const careers = require("../models/careers");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");




exports.createCareeers = async (req, res) => {
  try {
    const { status, jobTitle, keySkill, vancancy, workType, noOfopening, salaryRange, description } = req.body;

    if (!status || !jobTitle || !keySkill || !vancancy || !workType || !noOfopening || !salaryRange || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields"
      });
    }

    if (keySkill.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Key skill should be more than 5 characters"
      });
    }

    if (jobTitle.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Job Title should be more than 10 characters"
      });
    }

    if (description.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description should be more than 10 characters"
      });
    }

    const newCareers = new careers({
      status,
      jobTitle,
      keySkill,
      vancancy,
      workType,
      noOfopening,
      salaryRange,
      description
    });

    const savedCareers = await newCareers.save();

    res.status(201).json({
      success: true,
      message: "Career created successfully",
      offer: savedCareers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCareers = async (req, res) => {
  try {
      const { id } = req.params;
      const updateData = req.body;
    
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }
    
    const updatedCareer = await careers.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } 
    );
    
    // console.log("ggggg",updatedCareer);
    
    if (!updatedCareer) {
      return res.status(404).json({
        success: false,
        message: "Career not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Career updated successfully",
      data: updatedCareer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};
exports.deleteCareers = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }
    
    const deletedCareer = await careers.findByIdAndDelete(id);

    if (!deletedCareer) {
      return res.status(404).json({
        success: false,
        message: "Career not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Career deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};
