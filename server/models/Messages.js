const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

