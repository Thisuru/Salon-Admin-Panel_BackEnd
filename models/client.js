const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required']
    },
    phonenumber: {
        type: String,
        required: [true, 'Phonenumber is required']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    }
}, { timestamps: true });

//creating the model
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;