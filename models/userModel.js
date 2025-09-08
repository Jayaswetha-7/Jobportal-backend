const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs")
const jwt = require("jsonwebtoken");
const { ObjectId } =  mongoose.Schema;

const jobsHistorySchema = new mongoose.Schema ({

    title: {
        type: String,
        trim: true,
        maxlength: 70,
    },

    description: {
        type: String,
        trim: true,
        
    },
    salary: {
        type: String,
        trim: true,
      
    },
    location: {
        type: String,
    },
    interviewDate: {
        type: Date
    },
    applicatonStatus: {
        type: String,
        enum:['pending', 'accepted','rejected'],
        default: 'pending'
    },
    user:{
        type: ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

const userSchema = new mongoose.Schema ({

    firstName: {
        type: String,
        trim: true,
        required: [true, "first name is required"],
        maxlength: 10,
    },

    lastName: {
        type: String,
        trim: true,
        required: [true, "last name is required"],
        maxlength: 10,
    },
    email: {
        type: String,
        trim: true,
        required: [true, "email is required"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
          ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "password is required"],
        minlength: [6, "password must be atleast (6) characters"],
    },
    jobsHistory: [jobsHistorySchema],
    role:{
        type: Number,
        default: 0
    }
}, {timestamps: true})

//encryting password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
  
    this.password = await bcrypt.hash(this.password, 10); 
    next(); 
  });
  

//compare user password
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}
//return jwt token
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}

module.exports = mongoose.model("User", userSchema);