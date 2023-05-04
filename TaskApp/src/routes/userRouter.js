const express = require('express');
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();





router.get("/users/me",auth,async (req,res)=>{
    const user = await req.user.populate('tasks');

    res.status(200).json({user:user,tasks:user.tasks});
});

router.post("/users/logout",auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token;
        });
        await  req.user.save();
        res.status(200).json({message:"logout success"});
    }catch (e){
        res.status(500).json({message:e.message});
    }
});

router.post("/users/logoutAll",auth,async (req,res)=>{
    try {
        const users = await User.find({});
        for(const user of users){
            user.tokens=[];
            await user.save();
        }
        res.status(200).json({msg:"OK"});
    }catch (e){
        res.status(500).json({message:e.message});
    }
});
//get all users

router.get("/users",auth,async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.send(error.message);
    }
})

//get all users

//get user by id
router.get("/users/:id",auth,async (req,res)=>{
    try {
        const {id}=req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json(user);
    }catch (e){
        res.status(400).json({message:e.message});
    }
});
//get user by id

//create new user
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(200).json({user:user,msg:"daon"});
    }catch (err) {
        res.status(401).json({message:err.message});
    }
});
//create new user

//delete user by id
router.delete("/users/:id",auth,async (req,res)=>{
    try {
        const {id}=req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json(user);
    }catch (err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});
//delete user by id

//update user by id
router.patch('/users/:id',auth,async (req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findOne({_id:id});
        if(!user){
            return res.status(404).json({message: `cannot find any user with Id ${id}`})
        }
        const fields = ["firstName","age","email","password"];
        fields.forEach((field)=>{
           if(req.body[field]){
               user[field]=req.body[field];
           }
        });

        await user.save();

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({message: error.message})
    }
});
//update user by id

//delete all users
router.delete("/users",async (req,res)=>{
    try {
        const user = await User.deleteMany();
        res.status(200).json({message:"successfully"})
    }catch (err){
        res.status(500).json({message:err.message});
    }
});
//delete all users

router.post("/users/login",async (req,res)=>{
 try {
     const user = await User.findOneByCredentials(req.body.email,req.body.password);
     const token = await user.generateAuthToken();
     res.status(200).json({message:"success",token:token});
 }catch (e){
   res.status(400).json({message:e.message});
 }
});


module.exports = router;