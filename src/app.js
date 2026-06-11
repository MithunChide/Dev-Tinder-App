
const express = require('express');
const connectDB = require("./config/database");
const User = require("./Models/user");
const app = express();

app.use(express.json()); // Add this middleware for JSON parsing


app.post("/signup", async (req, res) => {
   const user = new User(req.body);

   try {
   await user.save();
    res.send("User added successfully...")
   } catch (err) {
     console.log("Error:", err);
     res.status(400).send("Error saving the data:" + err.message)
   }
});


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

