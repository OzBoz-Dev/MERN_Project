const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    owner_username: { type: String },
    member_usernames: [{ type: String }], // array of user usernames
    messages:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);

