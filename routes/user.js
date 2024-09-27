// require the express js 
const express = require("express");
const router = express.Router();

// import the controlller 
const { Signup , login } = require("../controllers/Auth");

// import the middlewares from the middleware folder 
const {auth , isStudent , isAdmin , isTeacher} = require("../middlewares/auth");


// map the controller with the routes
router.post("/signup", Signup);
router.post("/login" , login);

// protected routes .......

// for the students
router.get("/student" , auth , isStudent , (req, res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for student"
    })
})

// for the admin 
router.get("/admin" , auth , isAdmin , (req, res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for Admin",
    });
});

/// protected route for the teacher
router.get("/teacher" , auth , isTeacher );

/// for the testing 
router.get("/test" , auth , (req,res) => {
    res.json({
        success:true,
        message:"welcome to protected route for the test",
    });
});


// exports the routes
module.exports = router;