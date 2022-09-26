const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Minimum password length is 6 characters']
    }
}, { timestamps: true });

//creating the model
const User = mongoose.model('User', userSchema);

module.exports = User;