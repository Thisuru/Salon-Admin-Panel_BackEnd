const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    client: {
        type: String,
        require: true
    },
    service: {
        type: String,
        require: true
    },
    stylist: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true
    }
}, { timestamps: true });

//creating the model
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;