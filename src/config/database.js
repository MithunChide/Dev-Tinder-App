

const mongoose = require('mongoose');

const connectDB = async () => { 
    await mongoose.connect("mongodb+srv://mithunchide29_db_user:qt2g4Nsste0HRYE6@mithundev.eyaylhn.mongodb.net/devTinder")
}

module.exports = connectDB;