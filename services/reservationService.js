const Reservation = require('../models/reservation');

//get all Reservation service
const getAll = (paramsPage) => {
    
    const page = Math.max(0, paramsPage)
    const perPage = 30;
    const reservation = Reservation.find().populate('client').populate('stylist')

    if (perPage) {
        console.log("Perpage: ", perPage);
        console.log("ParamsPage: ", paramsPage);
        reservation.limit(perPage* 1)
    }
    if (page) {
        reservation.skip(perPage * (page-1))
    }
    return reservation.exec()
    // return Reservation.find().populate('client').populate('stylist')
}

//All Reservation Count
const getAllReservationCount = () => {
    return Reservation.countDocuments();
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
    getAllReservationCount,
    createPost
}
