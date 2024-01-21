const mongoose = require('mongoose');
const User = require('./user-login');
const Schema = mongoose.Schema;

const postUser = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postUser);

module.exports = Post;