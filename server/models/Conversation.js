const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    member_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array of user IDs
    messages:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);

