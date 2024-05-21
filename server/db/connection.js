const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

function dbConnect() {
    
    mongoose.connect(process.env.DB_URI=`mongodb+srv://We_chat_admin:We_chat%40123@cluster0.dcp7l2f.mongodb.net/We&nbspChat?retryWrites=true&w=majority&appName=Cluster0`)

        .then(() => {
            console.log("Successfully connected to MongoDB Atlas");
        })
        .catch((error) => {
            console.log("Unable to connect to MongoDB Atlas");
            console.error(error)
        })
}

module.exports = dbConnect;