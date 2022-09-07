const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stylistSchema = new Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    phonenumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
}, { timestamps: true });

//creating the model
const Stylist = mongoose.model('Stylist', stylistSchema);

module.exports = Stylist;