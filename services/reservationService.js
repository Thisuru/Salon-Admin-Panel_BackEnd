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

//get single Reservation Service
const getSingle = (id) => {
    return Reservation.findById(id)
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

//Delete reservation Service
const deleteReservation = (id) => {
    return Reservation.findByIdAndDelete(id)
}

//update reservation Service
const updateReservation = (id, reqBody) => {
    return Reservation.findByIdAndUpdate(id, reqBody, { useFindAndModify: false })
}


module.exports = {
    getAll,
    getAllReservationCount,
    getSingle,
    createPost,
    deleteReservation,
    updateReservation
}
