
const express = require('express');
const connectDB = require("./config/database");
const User = require("./Models/user");
const app = express();
const { validationSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth");

app.use(express.json()); // Add this middleware for JSON parsing
app.use(cookieParser()); //reading the cookies


//addn the data into database
app.post("/signup", async (req, res) => {
   try {
    //validate the data
    validationSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;
    //Encrypt the password
    const passwordHas = await bcrypt.hash(password, 10)    
    //store in the database
   const user = new User({
    firstName,
    lastName,
    emailId,
    password:passwordHas,
   });

   await user.save();
    res.send("User added successfully...")
   } catch (err) {
     console.log("Error:", err);
     res.status(400).send("ERROR: " + err.message)
   }
});

//login API 
app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        //find out the user and validate
        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid credential")
        }
        //campare the password wheather is same or not
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid) {
            throw new Error("Invalid credential")
        }
        //create the jwt token 
       const token = await user.getJWT();
       // Add the token to the cookies and send back to the user
       res.cookie("token" , token, {expires : new Date(Date.now() + 7*24*60*60*1000)});
       res.send("Yeahhhhh...Login Successfully!!!")
       
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

//Get User Profile by validating the cookies and token and send the user profile to the client/browser
app.get("/profile",  userAuth, async (req,res) => {
    try {
        const user = req.user;
        console.log(user);
        res.send(user);
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

//Post - sendConnectionRequest
app.post("/sendConnectionRequest", userAuth, async (req,res) => { 
    try {
        const user = req.user;
        console.log("sending the connection")
        res.send(user.firstName + " has send the request")
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

connectDB()
.then(() => {
    console.log("Database connection established...")
    app.listen(7777, () => {
        console.log('Server is successfully listening on port 7777...');
    });
})
.catch(err => {
    console.error("Database cannot connected...", err);
})

