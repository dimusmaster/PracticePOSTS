const mongoose = require('mongoose');
const User = require('./user-login');
const Post = require('./post');
const Schema = mongoose.Schema;

const comment = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"post",
        required: true
    },
    parent_id: {
        type: String
    }
}, {timestamps: true});

const Comment = mongoose.model('comment', comment);

module.exports = Comment;