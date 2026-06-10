
const express = require('express');
const connectDB = require("./config/database");
const User = require("./Models/user");
const app = express();

app.use(express.json()); // Add this for JSON parsing


app.post("/signup", async (req, res) => {
   console.log("Signup request received");
   const user = new User({
        firstName :"Rohit",
        lastName: "Sharma",
        email:"rohit@gmail.com",
        password:"Rohit@143"
   });

   try {
   await user.save();
    res.send("User added successfully...")
   } catch (err) {
     console.log("Error:", err);
     res.status(400).send("Error saving the data:" + err.message)
   }
});



connectDB().
then(() => {
    console.log("Database connection established...")
    app.listen(7777, () => {
        console.log('Server is successfully listening on port 7777...');
    });
}).catch(err => {
    console.error("Database cannot connected...", err);
})

