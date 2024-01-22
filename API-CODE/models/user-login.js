const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true
    },
    password: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const User = mongoose.model('user', user);

module.exports = User;