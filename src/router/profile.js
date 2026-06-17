
const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfiledata} = require("../utils/validation")
 const validator = require("validator");
 const bcrypt = require("bcrypt");

//Get User Profile by validating the cookies and token and send the user profile to the client/browser
profileRouter.get("/profile/view",  userAuth, async (req,res) => {
    try {
        const user = req.user;
        // console.log(user);
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
         res.json({
            message :`${loggedInUser.firstName} your profile has been updated.`,
            data:loggedInUser
         })
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

profileRouter.patch("/profile/password", userAuth, async(req,res) => {
    try{
        //  console.log("BODY:", req.body);
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        if (!currentPassword || !newPassword) {
            throw new Error("Both current and new password are required");
        }

        const isMatch = await user.validatePassword(currentPassword);
        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }
       
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New password is not strong enough");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save({ validateBeforeSave: false });

        res.send("Password updated successfully");
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
});
module.exports = profileRouter;