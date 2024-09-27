// main logic
// import the bcrypt library used to help you hash the passwords  ....
const bcrypt = require("bcrypt"); 
// import the models to intract with the database
const User = require("../models/user");
// require the json web token package to make the web token 
const jwt = require("jsonwebtoken");

// import the elements from the env file
require("dotenv").config();

// create the sign up route controller 

exports.Signup = async (req,res) => {
    try{
        // fetch  the data from the body 
        const{name, email, password, role} = req.body;
        // check if the user is already exist or not 
        const existingUser = await User.findOne({email});
        // if response is yes , then told user already exist 
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already Exist ",
            });
        }

        // secure the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashhing password",
            })
        }

        // create a entry for the user 
        const user = await User.create({
            name , email , password:hashedPassword , role
        });

        // if successfull 
        res.status(200).json({
            success:true,
            message:"User created succesfully",
        })

    }
    catch(err){
        console.log(err);
        console.error(err);
        res.status(500).json({
            success:false,
            message:"user cann't be registered , please try again later ..... "
        })
    }
}


/// create the login route  for the login ..... 

exports.login = async (req,res) => {
    try{
        //fetch the data from the body
        const {email, password} = req.body;

        // apply the validation 
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"enter the details correct"
            })
        }

        // check if the user present in the database already
        let user = await User.findOne({email});
        // if the user don't exists ,send the respose
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user doesn't exist , create account first .."
            })
        }

        // create the payload for the jwt token 

        const payload = {
            email:user.email,
            id : user._id,
            role:user.role
        };

        // verify the password and generate the JWT token for the user ..
        if(await bcrypt.compare(password , user.password)){
            // password matches succesfully 

            // create the jwt token for the user id 
            let token = jwt.sign(payload , process.env.JWT_SECRET , {
                     expiresIn : "2h",
            })

            // add the token in the user object and show the password as undefined to protect the password from the hacker 
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            // create the cokkie 

            //3*24*60*60*1000 // means cookie will expire in the 3 days 
            
            // create the options  for  the cokkie 
            const options = {
                // ab 30000 says cookie will expire after the 30 secs , thats why portal kyo login krwata h kux din baad
                expires : new Date( Date.now() + 30000),
                httpOnly: true,
            }

            // we will send the cokkie for in the response 

            res.cookie("token" , token , options ).status(200).json({
                success:true,
                user,
                token,
                message:"user logged in succesfully ...."
            })

            // res.status(200).json({
            //     success:true,
            //     user,
            //     token,
            //     message:"user logged in succesfully ...."
            // })

        }
        else{
            // password doesn't match successfully 
            return res.status(403).json({
                success:false,
                message:"password doesn't match",
            })
        }
        



    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            sucess:false,
            message: "error while login the user , please try again .."
        })
    }
}
