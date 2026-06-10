
const express = require('express');
const app = express();

const { adminAuth, userAuth }= require('./middlewares/auth');

app.use("/admin", adminAuth); //middleware for admin routes

app.get('/user', userAuth, (req,res) => {
    res.send("User data added")
})

app.get('/admin/getAdminData', (req,res) => {
    res.send("Get all the admin data")
})

app.get('/admin/deleteAdminData', (req,res) => {
    res.send("Delete the admin data")
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});