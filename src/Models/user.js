
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: 3,

    },
    lastName : {
        type: String,
    },
    email : {
        type: String,
        lowercase : true,
        required: true,
        unique:true,
        trim:true,
    },
    password : {
        type: String,
        required: true,
        minLength: 6
    },
    age : {
        type: Number,
        min: 18,
    },
    gender : {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value.toLowerCase())) { 
                throw new error ("Gender does not match the required format")
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
},
{
    timestamps:true,
})


module.exports = mongoose.model("User", userSchema);
   

