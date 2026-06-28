
const express = require("express");
const authRouter = express.Router();
const {validationSignUpData} = require("../utils/validation");
const User = require("../Models/user");
const bcrypt = require("bcrypt");

//addn the data into database
authRouter.post("/signup", async (req, res) => {
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

   const savedUser = await user.save();
     const token = await savedUser.getJWT();
       // Add the token to the cookies and send back to the user
       res.cookie("token" , token, {expires : new Date(Date.now() + 7*24*60*60*1000)});
    res.json({
        message :"User added successfully..." , 
        data : savedUser})
   } catch (err) {
     console.log("Error:", err);
     res.status(400).send("ERROR: " + err.message)
   }
});

//login API 
authRouter.post("/login", async (req, res) => {
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
       res.json({
        message: "Login Successfully...",
        data : user
       })
       
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {expires : new Date(Date.now())});
        res.send("Logout Successfully!!!")
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})
module.exports = authRouter;