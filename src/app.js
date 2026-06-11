
const express = require('express');
const connectDB = require("./config/database");
const User = require("./Models/user");
const app = express();

app.use(express.json()); // Add this middleware for JSON parsing

//addn the data into database
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

//Get the user using email from the database
app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.find({email: userEmail});
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
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully...")
    }catch (err) { 
        res.status(400).send("something went wrong")
    }
})

//Patch - update the user details in the database

// app.patch("/user", async (req, res) => {
//     const userId = req.body.userId
//     const data = req.body
//     try {
//         const user = await User.findByIdAndUpdate(userId,data, { returnDocument: 'after'});
//         console.log(user);
//         res.send("User updated successfully...")
//     } catch (err) { 
//         res.status(400).send("something went wrong")
//     }
// })

app.patch("/user", async (req, res) => {
    const {email} = req.body;
    const data = req.body

    try {
        const user = await User.findOneAndUpdate({email}, data, { returnDocument: 'after'});
        console.log(user);
        res.send("User updated successfully...")
    } catch (err) { 
        res.status(400).send("something went wrong" + err.message)
    }
})


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

