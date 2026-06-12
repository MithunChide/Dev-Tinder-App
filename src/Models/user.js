
const mongoose = require("mongoose");

const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: 3,

    },
    lastName : {
        type: String,
    },
    emailId : {
        type: String,
        lowercase : true,
        required: true,
        unique:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)) { 
                throw new Error("Email address is invalid" + value)
            }
        },
    },
    password : {
        type: String,
        required: true,
        minLength: 6,
        validate(value) {
            if(!validator.isStrongPassword(value)) { 
                throw new Error("Password is not strong enough" + value)
            }
        },
    },
    age : {
        type: Number,
        min: 18,
    },
    gender : {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value.toLowerCase())) { 
                throw new Error ("Gender does not match the required format")
            }
        }
    },
    skills : {
        type: [String]
    },
    phoneNumber: {
        type: Number,
        min: 1000000000,
        max: 9999999999
    },
    about : {
        type: String,
        default: "Believe on yourSelf... God's Plan...",
    },
    photoUrl: {
        type: String,
         validate(value) {
            if(!validator.isURL(value)) { 
                throw new Error("photo url is not valid" + value)
            }
        },
    }
},
{
    timestamps:true,
})


module.exports = mongoose.model("User", userSchema);
   

