const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    pfp: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true, 
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    status: {
        type: String,
        default: 'Offline'
    }
});

const User = mongoose.model('User', userSchema); // Changed from Users to User

module.exports = User; // Changed from Users to User
