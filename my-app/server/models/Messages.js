const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    //    fill hall ek ko
    conversationId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000 // Example maximum length constraint
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;

