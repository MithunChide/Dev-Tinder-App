
const express = require("express");

const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../Models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about"
//Get all the interested request for the loggedIn user
userRouter.get("/user/requests/receive", userAuth, async(req, res) =>{
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        // .populate("fromUserId", ["firstName" ,"lastName", "photoUrl" ,"age", "gender" ,"about"]) ..another way of populating the data

        res.json({
            message: "data fetched succesfully",
            data : connectionRequest
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status :"accepted"},
                {fromUserId : loggedInUser._id, status :"accepted"}

            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        //to get only user_safe_data for the connection
        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({
            message: "Connection request",
            data
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = userRouter;