const mongoose = require("mongoose");
require('dotenv').config();

exports.connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
};