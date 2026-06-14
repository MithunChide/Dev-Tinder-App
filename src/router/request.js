
const express = require("express");

const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")

//Post - sendConnectionRequest
requestRouter.post("/sendConnectionRequest", userAuth, async (req,res) => { 
    try {
        const user = req.user;
        console.log("sending the connection")
        res.send(user.firstName + " has send the request")
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = requestRouter;