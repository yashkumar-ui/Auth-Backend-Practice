const mongoose = require("mongoose");

// import the database url from the dotenv file 
require("dotenv").config();


// create the db function 
const dbConnect = () => {
    mongoose.connect( process.env.DATABASE_URL , {
        //  useNewUrlParser : true,
        //  useUnifiedTopology : true
    } ).then( () => console.log("DB connected succesfullly "))
    .catch( (error) => {
        console.log("issue in the DB connection");
        console.log(error);
        process.exit(1);
    })
}

// exports the function 

module.exports = dbConnect;