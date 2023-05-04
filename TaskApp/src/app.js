const express = require("express");
const {mongoose} = require("mongoose");

require("dotenv").config({path:'./.env'}); //process.env

const url = process.env.MONGO_URL;
const port = process.env.PORT;

const userRoutes = require('./routes/userRouter');
const taskRoutes = require('./routes/taskRouter');


mongoose.connect(url);
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(taskRoutes);

app.use(userRoutes);

const server = app.listen(port, () => {
    console.log(`Server is listening on ${port} port`)
})

module.exports = server;


