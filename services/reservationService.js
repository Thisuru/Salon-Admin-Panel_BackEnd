const Reservation = require('../models/reservation');

//get all Reservation service
const getAll = async (params) => {

    let filters = {}

    if (params?.search) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(params.search);

      filters.$or = [
          { service: { $regex: searchRgx, $options: "i" } },
          { status: { $regex: searchRgx, $options: "i" } },
          // { firstname: { $regex: searchRgx, $options: "i" } },
          // { email: { $regex: searchRgx, $options: "i" } }
      ]
  }
    
    const page = Math.max(0, params?.page || 1)
    const perPage = 30;
    // const reservation = Reservation.find().populate('client').populate('stylist')
    const reservation = Reservation.find(filters).populate('client').populate('stylist')

    if (perPage) {
        
        console.log("ParamsPage: ", params?.page || 1);
        reservation.limit(perPage * 1)
    }
    if (page) {
        reservation.skip(perPage * (page-1))
    }
    // return reservation.exec()
    return {data : await reservation}
    // return Reservation.find().populate('client').populate('stylist')
}

//All Reservation Count
const getAllReservationCount = () => {
    return Reservation.countDocuments();
}

//Completed Reservation Count
const getCompletedReservationCount = () => {
    return Reservation.countDocuments({status: 'completed'});
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

//get reserved stylist Ids
const getReservedStylishIds = (start, end) => {
    return Reservation.distinct("stylist", {
      $and: [
        {
          startTime: {
            $lte: start,
          },
          endTime: {
            $gte: start,
          },
          startTime: {
            $lte: end,
          },
          endTime: {
            $gte: end,
          },
        },
      ],
    });
  };

  //update reservation status service
  const updateReservationStatus = (status, id) => {
    console.log("Status: ", status);
    return Reservation.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } }
    );
  };
  
module.exports = {
    getAll,
    getAllReservationCount,
    getSingle,
    createPost,
    deleteReservation,
    updateReservation,
    getReservedStylishIds,
    getCompletedReservationCount,
    updateReservationStatus
}
