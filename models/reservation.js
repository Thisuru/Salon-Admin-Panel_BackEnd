const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client',
        required: [true, 'client id is required']
    },
    service: {
        type: String,
        required: [true, 'Service is required']
    },
    stylist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stylist',
        required: [true, 'Stylist id is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    status: {
        type: String,
        enum: ["pending", "inProgress", "completed", "cancelled", "deleted"],
        default: "pending",
    },
}, { timestamps: true });

//creating the model
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;