
const express = require('express');
const app = express();


app.use("/test",(req,res) => {
    res.send("Hello testing")
})
app.use("/mithun",(req,res) => {
    res.send("Hey Mithun....enjoy coding")
})
app.use("/",(req,res) => {
    res.send("Hello worlld")
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});