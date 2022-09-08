const Reservation = require('../models/reservation');

//get all Reservation service
const getAll = () => {
    return Reservation.find().populate('client').populate('stylist')
}

//Reservation create post API call service
const createPost = (reservation) => {
    return Reservation.create(reservation)
}

module.exports = {
    getAll,
    createPost
}
