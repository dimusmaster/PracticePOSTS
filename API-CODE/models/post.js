const mongoose = require('mongoose');
const User = require('./user-login');
const Schema = mongoose.Schema;

const post = new Schema({
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
    },
    is_deleted: {
        type: Boolean,
        default: false,
        required: true
    }
}, {timestamps: true});

const Post = mongoose.model('post', post);

module.exports = Post;