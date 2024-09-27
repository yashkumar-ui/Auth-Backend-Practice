// creating the middleware here 

// is auth , isStudent , isTeacher auth will be created here
// after that exports the middlewares for  it 

// require the json web token and the env file config 
const jwt = require("jsonwebtoken");

require("dotenv").config();

// create the auth function 
exports.auth = (req,res , next) =>{
    try{
        // fetxh the token  from the body 
        /// different ways to fetch the token 
        // const token = req.body.token;
        console.log("body = " ,req.body.token);
        console.log("cookie = ", req.cookies.token);
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        // if the token is not present in the body
        if(!token || token === undefined){
            return res.status(401).json({
                succes:false,
                message:"token missing , add the token "
            })
        }

        // after fetching the token , we will verify it , valid or not 
        // use the try catch to verify the token not the if else 
        try{
             // verify the token using the jwt verification method
             const payload = jwt.verify(token , process.env.JWT_SECRET);
             console.log(payload);

             // add the payload in the req body to further give the acces to the private routes 
             req.user = payload;

        } catch(err){
            res.status(401).json({
                succes:false,
                message:"token invalid "
            })
        }

        next();
    
    } catch(err){
        return res.status(400).json({
            succes:false,
            message:"something went wrong while verify the user "

        })
    }
}

//  private route middleware for the students 

exports.isStudent = (req,res ,next) => {
    try{
        // check the role
        if(req.user.role !== "student"){
            return res.status(401).json({
                succes:false,
                message:"this is proteted route for the students only "
            })
        }
        next();

    } catch(err){
        return res.status(400).json({
            succes:false,
            message:"user role is n't matching "
        })
    }
}


// private route middleware for the admin 

exports.isAdmin = (req,res , next ) => {
    try{
        if(req.user.role !== 'admin'){
            return res.status(401).json({
                succes:false,
                message:" this is protected route for the admin only "
            })
        }

        next();

    } catch(err){
        return res.status(400).json({
            succes:false,
            message:"user role is missing .."
        })
    }
}


//// private route for the teacher 
exports.isTeacher = (req,res, next) => {
    try{
        // check the user role for this route 
        if(req.user.role !== 'teacher'){
            return res.status(401).json({
                success:false,
                message:"this is proteted route for the teacher only "
            })
        }else{
            return res.status(200).json({
                succes:true,
                message:"Welcome to the protected route for the teacher only  "
            })
        }

        next();
    } catch(err){
        return res.status(400).json({
            success:false,
            message:"user role is missing ",
        })
    }
}

