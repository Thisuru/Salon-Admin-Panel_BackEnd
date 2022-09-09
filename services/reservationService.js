const Reservation = require('../models/reservation');

//get all Reservation service
const getAll = () => {
    return Reservation.find().populate('client').populate('stylist')
}

//Reservation create post API call service
const createPost = (reqBody) => {

    const reservation = new Reservation({
        client: reqBody.client,
        service: reqBody.service,
        stylist:reqBody.stylist,
        startTime: reqBody.startTime,
        endTime: reqBody.endTime,
        status: reqBody.status
    })

    return Reservation.create(reservation)
}

module.exports = {
    getAll,
    createPost
}
