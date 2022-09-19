const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
}, { timestamps: true });

//creating the model
const User = mongoose.model('User', userSchema);

module.exports = User;