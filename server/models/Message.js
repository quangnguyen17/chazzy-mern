const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    message: {
        type: String,
        require: true,
        minlength: [2, `'Message' must at least be 2 characters.`]
    },
    senderID: {
        type: String,
        require: [true, `Must have a senderID`],
    },
    receiverID: {
        type: String,
        require: [true, `Must have a receiverID`],
    },
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
