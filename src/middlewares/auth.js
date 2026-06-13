
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async(req,res,next) => {
    try {
        //validate the token
        const {token} = req.cookies;
        if(!token) {
            throw new Error("Token not found");
        }
        //verify the user topken
        const decodedObj = jwt.verify(token, "Dev@Tinder$2026");
        const {_id} = decodedObj;
        //find the user
        const user = await User.findById(_id);
        if(!user) { 
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
   
}

module.exports = {
    userAuth
}