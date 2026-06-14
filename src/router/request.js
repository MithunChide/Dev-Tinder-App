
const express = require("express");

const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user")

//Post - send ConnectionRequest
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res,next) => { 
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //request should be allowed for this allowed status only
        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)) {
            return res.status(404).json({
                message: "Invalid status type" + status,
            });
        }
        // find the user already exist or not if not throw error
        const toUser = await User.findById(toUserId)
        if(!toUser) {
            return res.status(404).json({
                message: "User not found!",
            })
        }

        //Check if there is existingConnectionRequest, then throw error
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId : fromUserId, toUserId : toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })
        if(existingConnectionRequest) {
            return res.status(404).json({
                message: "Connection request already exists!"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()
        res.json({
            message: req.user.firstName + " is " + status + " to " + toUser.firstName,
            data,
        })
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = requestRouter;