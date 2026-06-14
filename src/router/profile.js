
const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfiledata} = require("../utils/validation")

//Get User Profile by validating the cookies and token and send the user profile to the client/browser
profileRouter.get("/profile/view",  userAuth, async (req,res) => {
    try {
        const user = req.user;
        console.log(user);
        res.send(user);
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
         if(!validateEditProfiledata(req)) {
            throw new Error("Editable profile not found")
         }
         const loggedInUser = req.user;//reading from userAuth
         Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

         if(loggedInUser.skills.length > 10) {
            throw new Error("Skills should be less than 10")
         }
         await loggedInUser.save();
         res.send(`${loggedInUser.firstName} your profile has been updated.`)
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = profileRouter;