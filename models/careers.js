const mongoose = require('mongoose');
const careerSchema = new mongoose.Schema({
status:{
    type:String,
    enum:['Active','InActive'],
},
description:{
    type:String,
    minlength:[10,'Description must be at least 10 characters long'],
    required:true,
},
jobTitle:{
    type:String,
    minlength:[10,'Job Title must be at least 10 characters long'],
    required:true,
},
keySkill:{
    type:String,
    minlength:[10,'Key Skill must be at least 10 characters long'],
    required:true,
},
vancancy:{
    type:String,
    enum:["open","close"],
    required:true,
},
workType:{
    type:String,
    enum:["on-site","wfh","hybrid"],
    required:true,
},
noOfopening:{
    type:Number,
    required:true,
},
salaryRange:{
    type:String,
    required:true,
}
});
module.exports = mongoose.model("careers", careerSchema);
