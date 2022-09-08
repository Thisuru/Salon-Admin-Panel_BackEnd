const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client'
    },
    service: {
        type: String,
        require: true
    },
    stylist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stylist'
    },
    date: {
        type: Date,
        require: true
    }
    // time: {
    //     type: String,
    //     require: true
    // }
}, { timestamps: true });

//creating the model
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;