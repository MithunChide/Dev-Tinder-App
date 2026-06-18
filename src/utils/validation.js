
const validator = require("validator");

const validationSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body
    if(!firstName || !lastName) { 
        throw new Error("First name and last name are required");
    } else if (firstName.length < 3 || firstName.length > 50) {
        throw new Error("First name length should be 3-50 characters");
    } else if(!validator.isEmail(emailId)) { 
        throw new Error("Email address is invalid");
    } else if (!validator.isStrongPassword(password)) { 
        throw new Error("Password is not strong enough");
    }
}

const validateEditProfiledata = (req) => {
    const editAllowedData = ["firstName", "lastName","emailId", "about", "skills", "gender", "photoUrl", "age" ]

    const isEditAllowed = Object.keys(req.body).every((field) => editAllowedData.includes(field))

    return isEditAllowed;
}
module.exports = {
    validationSignUpData,
    validateEditProfiledata,
}