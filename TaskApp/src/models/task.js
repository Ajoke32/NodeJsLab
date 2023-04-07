const mongoose = require("mongoose")
const validator = require("validator");

const taskSchema = new mongoose.Schema({
   title:{
       type:String,
       required: true,
       trim:true,
   },
    description:{
       type:String,
       required:true,
        trim:true
    },
    completed:{
       type:Boolean,
        default:false
    }
   ,
    owner:{
       type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task