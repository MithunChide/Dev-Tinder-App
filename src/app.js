
const express = require('express');
const connectDB = require("./config/database");
const User = require("./Models/user");
const app = express();
const { validationSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json()); // Add this middleware for JSON parsing
app.use(cookieParser()); //reading the cookies

//addn the data into database
app.post("/signup", async (req, res) => {
   try {
    //validate the data
    validationSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;
    //Encrypt the password
    const passwordHas = await bcrypt.hash(password, 10)    
    //store in the database
   const user = new User({
    firstName,
    lastName,
    emailId,
    password:passwordHas,
   });

   await user.save();
    res.send("User added successfully...")
   } catch (err) {
     console.log("Error:", err);
     res.status(400).send("ERROR: " + err.message)
   }
});

//login API 
app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        //find out the user and validate
        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid credential")
        }
        //campare the password wheather is same or not
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new Error("Invalid credential")
        }
        //create the jwt token 
       const token = await jwt.sign({_id : user._id}, "Dev@Tinder$2026")
       // Add the token to the cookies and send back to the user
       res.cookie("token" , token);
       res.send("Yeahhhhh...Login Successfully!!!")
       
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

//Get User Profile by validating the cookies and token and send the user profile to the client/browser
app.get("/profile", async (req,res) => {
    try {
        const cookies = req.cookies;
        const {token} = cookies;
        //validate the token
         if(!token) {
            throw new Error("Invalid Token")
         }
         //verify the user token
        const decodedMessage = await jwt.verify(token, "Dev@Tinder$2026");
         //getting user _id from the decaodedMessage
        const {_id} = decodedMessage;
         //getting user profile
        const user = await User.findById(_id)
        //validating user
        if(!user) {
            throw new Error("Invalid User")
        }
        //sendring the response to client/browser for user profile
        res.send(user);

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

//Get the user using email from the database
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.find({emailId: userEmail});
        if(user.length === 0) {
            res.status(404).send("User not found")
        } else {
            res.send(user);
        }
    } catch (err) { 
        res.status(400).send("something went wrong")
    }
});

//Get /feed all the users from the database 
app.get("/feed", async (req,res) => {
     try {
        const users = await User.find({});
        if(!users) {
            res.status(404).send("User not found")
        } else {
            res.send(users);
        }
    } catch (err) { 
        res.status(400).send("something went wrong")
    }

});

//Delete the user from the database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return res.status(404).send("User not found")
        }
        res.send("User deleted successfully...")
    }catch (err) { 
        res.status(400).send("something went wrong" + err.message)
    }
})

//Patch - update the user details in the database

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body
    try {
        const ALLOWED_UPDATED = ["about", "skills","age","photoUrl"]

        const isUpdated = Object.keys(data).every((k) => ALLOWED_UPDATED.includes(k))

        if(!isUpdated) {
            throw new Error("Updated not found")
        }
        if(data?.skills.length > 10) {
            res.status(400).send("Skills should not be more than 10")
        }
        const user = await User.findByIdAndUpdate(userId,data, { returnDocument: 'after', runValidators: true});
        if(!user) {
            return res.status(404).send("User not found")
        }
        // console.log(user);
        res.send("User updated successfully...")
    } catch (err) { 
        res.status(400).send("Update profile failed: " + err.message)
    }
})

// app.patch("/user", async (req, res) => {
//     const {email} = req.body;
//     const data = req.body

//     try {
//         const user = await User.findOneAndUpdate({email}, data, { returnDocument: 'after'});
//         console.log(user);
//         res.send("User updated successfully...")
//     } catch (err) { 
//         res.status(400).send("something went wrong" + err.message)
//     }
// })


connectDB()
.then(() => {
    console.log("Database connection established...")
    app.listen(7777, () => {
        console.log('Server is successfully listening on port 7777...');
    });
})
.catch(err => {
    console.error("Database cannot connected...", err);
})

