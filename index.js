//  import the express framework ]
const express = require("express");
const app = express();

// extract the data from the dotenv
require("dotenv").config();

const PORT = process.env.PORT || 4000 ;

/// require the cookie parser 
const cookieParser = require("cookie-parser");
// set up the cookie parser middleware 

app.use(cookieParser());

// setup the middleware 
app.use(express.json());

// importh the database function and start it 
const dbConnect = require("./config/database");
dbConnect();
// another way to connect the database........> 
//    require("./config/database").dbConnect();


// import the router from the db folder
const user = require("./routes/user");
// mount the route on api.vi
app.use("/api/v1" , user);

// start the server 
app.listen(PORT , () => {
    console.log(`app started successfully at ${PORT}`);
})

// make the default route for the application......
app.get( '/' , (req,res) => {
    res.send(`<h1>hello baby...</h1>`);
})

