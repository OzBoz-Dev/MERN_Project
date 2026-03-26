const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String},
    body: {type: String},
    attachments: {type: String}, //Will store the URL or file path
    likes: {type: String},
    array_tags_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags'}],
    
},{timestamps: true});

module.exports = mongoose.model('Post', postSchema);





