const mongoose = require("mongoose")
const validator = require("validator");
const bcrypt  = require("bcrypt");
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim:true
    },
    age: {
        type: Number,
        default: 20,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error("must be a positive number")
            }
        }
    },
    email:{
      type:String,
      required:true,
      trim:true,
      lowercase:true,
      unique:true,
        validate(value){
          if(!validator.isEmail(value)){
              throw new Error("incorrect format");
          }
        }
    },
    password:{
        required:true,
        type:String,
        trim:true,
        validate(value){
            if(value.length<7){
                throw new Error(" min length is 7")
            }
            if(value.includes("password")){
                throw  new Error("password is weak")
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
},{ toJSON: { virtuals: true } },{ toObject: { virtuals: true } });

userSchema.pre("save",async  function(next){
    const user = this;
   if(this.isModified("password")){
       user.password = await  bcrypt.hash(user.password,8);
   }
   next();
});

userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() },
        'secretprtkeys');

    user.tokens = user.tokens.concat({token});

    await user.save();

    return token;
}
userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete  userObject.tokens;
    return userObject;
}
userSchema.virtual('tasks',{
   ref:'Task',
   localField:'_id',
   foreignField:'owner'
});

userSchema.statics.findOneByCredentials = async (email,password)=>{
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Check you email data");
    }
    const isMatch = await  bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Incorrect password");
    }
    return user;
};

const User = mongoose.model("User", userSchema)

module.exports = User