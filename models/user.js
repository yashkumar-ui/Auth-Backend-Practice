const mongoose = require("mongoose");

// create a model 

const userSchema =  new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    email : {
        type:String,
        required:true,
        trim:true,
    },
    password : {
        type:String,
        required:true,
        trim:true,
    },
    role : {
        type:String,
        enum:["admin" , "student" , "teacher"]
    }
})

// export the model

module.exports = mongoose.model("user" , userSchema);