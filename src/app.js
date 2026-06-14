
const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json()); // Add this middleware for JSON parsing
app.use(cookieParser()); //reading the cookies

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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

