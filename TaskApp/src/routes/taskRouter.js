const express = require('express');
const Task = require("../models/task");
const auth = require("../middleware/auth");


const router = express.Router();


//create new task
router.post("/tasks/add",auth,async (req,res)=>{

    const task = new Task({
       ...req.body,
       owner:req.user.id
    });
    task.populate("owner");
    try{
        await task.save();
        res.status(200).json(task);
    }catch (e){
        res.status(500).json({message:e.message});
    }
});
//create new task

//get all tasks
router.get("/tasks",auth,async (req,res)=>{
    const tasks = await Task.find({owner:req.user.id});

    res.send(tasks);
});
//get all tasks

//get task by id
router.get("/task/:id",auth,async (req,res)=>{
    try {
        const {id}=req.params;
        const task = await Task.findOne({_id:id,owner:req.user.id});
        if(!task){
            return res.status(404).json({message:"task not found"})
        }
        res.status(200).json(task);
    }catch (e){
        res.status(400).json({message:e.message});
    }
});
//get task by id

//update task by id
router.patch('/tasks/:id',auth,async (req,res)=>{
    try {
        const {id} = req.params;
        const task = await Task.findOne({_id:id,owner:req.user.id});
        if(!task){
            return res.status(404).json({message: `cannot find any task with Id ${id}`})
        }
        const fields = ["title","description","owner","completed"];
        fields.forEach((field)=>{
            if(req.body[field]){
                task[field]=req.body[field];
            }
        });
        task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});
//update task by id

//delete task by id
router.delete("/task/:id",auth,async (req,res)=>{
    try {
        const {id}=req.params;
        const task = await Task.findOne({_id:id,owner:req.user.id});
        if(!task){
            return res.status(404).json({message:"task not found"})
        }
        await Task.deleteOne(task);
        res.status(200).json(task);
    }catch (err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});
//delete task by id

//delete all task
router.delete("/tasks",auth,async (req,res)=>{
    try {
        const tasks = await Task.deleteMany({owner:req.user.id});
        res.status(200).json({message:"successfully"})
    }catch (err){
        res.status(400).json({message:err.message});
    }
});
//delete all task
module.exports = router;