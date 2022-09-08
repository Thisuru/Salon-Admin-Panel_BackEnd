const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
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
    // reservation : [
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation'}
    // ]
}, { timestamps: true });

//creating the model
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;