const sioVerifyToken = require('../middlewares/sioVerifyToken.js')
const User = require('../models/User.js');
const Messages = require('../models/Messages.js');

function initSockets(io) {
    io.use(sioVerifyToken).on('connection', (socket) => {

        console.log(socket.id)

        socket.on('sendMessage', async (data) => {
            try {
                const user = await User.findById(socket.id);

                const message = await Messages.create({
                    message: data.messageObj.message,

                    timestamp: new Date(),

                    receiverId: data.receiverId,
                    senderId: user._id
                })

                const messageObj = message._doc;

                io.to(data.receiverId).emit('receiveMessage', {
                    ...messageObj,
                    isMyMessage: false
                });


                // send confirmed
                socket.emit('sendMessageConfirmed', {
                    id: data.messageObj.id,
                    // messageId: data.messageObj.messageId,
                    receiverId: data.receiverId,
                    timestamp: messageObj.timestamp
                });
            }
            catch (e) {
                socket.emit('sendMessageError', { message: 'Internal server error' });
            }
        })

    })
}

module.exports = initSockets;