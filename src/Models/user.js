
const mongoose = require("mongoose");

const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');

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
        enum : {
            values:["male", "female", "other"],
            message: "{VALUE} is not the gender type"
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

//generating/creating the token help function
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id : user._id}, "Dev@Tinder$2026",{ expiresIn: '7d' })

    return token;
}

//validation the password  helper function
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHas = user.password
    
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHas);

    return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);
   

