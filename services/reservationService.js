const Reservation = require('../models/reservation');
const BSON = require('bson');

//get all Reservation service
const getAll = async (params) => {
  const sort = 'NEWEST';
  const limit = 30;
  // const sort = params?.sort;
  // const limit = params?.limit
  const search = params?.search;
  const page = params?.page;

  const pageNum = page * 1 || 1;
  const theLimit = limit * 1 || 10;
  const skipVlue = (pageNum - 1) * theLimit;

  let query = [{}];
  let sortQuery = {};

  if (sort == 'NEWEST') {
    sortQuery = {
      _id: -1,
    };
  }

  if (sort == 'OLDEST') {
    sortQuery = {
      _id: 1,
    };
  }

  if (search && search.trim() != '') {
    query = [
      { clientFullName: { $regex: search } },
      { stylistFullName: { $regex: search } },
      { service: { $regex: search } },
      { status: { $regex: search } },
    ];
  }

  const reservation = await Reservation.aggregate([
    {
      '$lookup': {
        'from': 'clients',
        'localField': 'client',
        'foreignField': '_id',
        'as': 'clients'
      }
    }, {
      '$lookup': {
        'from': 'stylists',
        'localField': 'stylist',
        'foreignField': '_id',
        'as': 'stylists'
      }
    }, {
      '$unwind': {
        'path': '$clients'
      }
    }, {
      '$unwind': {
        'path': '$stylists'
      }
    }, {
      '$addFields': {
        'clientFullName': {
          '$concat': [
            '$clients.firstname', ' ', '$clients.lastname'
          ]
        },
        'stylistFullName': {
          '$concat': [
            '$stylists.firstname', ' ', '$stylists.lastname'
          ]
        }
      }
    }, {
      '$match': {
        '$or': [...query]
      }
    },
    {
      $sort: { ...sortQuery },
    },
    {
      $skip: skipVlue * 1,
    },
    {
      $limit: theLimit * 1,
    }
  ]);

  return { data: reservation };
}

//All Reservation Count
const getAllReservationCount = () => {
  return Reservation.countDocuments();
}

//Completed Reservation Count
const getCompletedReservationCount = () => {
  return Reservation.countDocuments({ status: 'completed' });
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
    stylist: reqBody.stylist,
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

//Get Reservation By stylist id (Drag drop calnedar Validation)
const getReservationByReservationDetails = (start, end) => {
  return Reservation.distinct("_id", {
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
        }
      },
    ],
  });
}

//update reservation status service
const updateReservationStatus = (status, id) => {
  console.log("Status: ", status);
  return Reservation.findOneAndUpdate(
    { _id: id },
    { $set: { status: status } }
  );
};

//Update Reservation date service
const updateReservationDateForDragDrop = (startTime, endTime, id, stylist) => {
  return Reservation.findOneAndUpdate(
    { _id: id },
    { $set: { startTime: startTime, endTime: endTime } }
  );
};

//Check Droped date is a past date or not
const isInThePast = (date) => {
  console.log("isInThePast date: ", date);
  const droppedDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return droppedDate < today;
}

//get single Reservation Service
const getSpecificFieldsById = (id) => {
  // return Reservation.findById(
  //   id,
  //   {stylist: 1, startTime: 1, endTime: 1}
  //   )
  
  const reservation = [
    {
      '$match': {
         _id: BSON.ObjectId(id) 
      }
    },
    {
      '$lookup': {
        'from': 'clients',
        'localField': 'client',
        'foreignField': '_id',
        'as': 'clients'
      }
    }, {
      '$lookup': {
        'from': 'stylists',
        'localField': 'stylist',
        'foreignField': '_id',
        'as': 'stylists'
      }
    }, {
      '$unwind': {
        'path': '$clients'
      }
    }, {
      '$unwind': {
        'path': '$stylists'
      }
    }, {
      '$addFields': {
        'clientFullName': {
          '$concat': [
            '$clients.firstname', ' ', '$clients.lastname'
          ]
        },
        'stylistFullName': {
          '$concat': [
            '$stylists.firstname', ' ', '$stylists.lastname'
          ]
        }
      }
    }
  ];

  const results = Reservation.aggregate(reservation)
  return results

}

//get current week reservations
const getThisWeekReservationIds = () => {

  let currentDate = addWeeks(0);
  let thisWeekEndDate = addWeeks(1);

  return Reservation.distinct("_id", {
    $and: [
      {
        startTime: {
          $gte: currentDate,
          $lte: thisWeekEndDate
        }
      },
    ],
  });
}
//get the week after date from the current date
function addWeeks(numOfWeeks, date = new Date()) {
  date.setDate(date.getDate() + numOfWeeks * 7);
  return date;
}

//get startTime and endTime difference
const getTimeDifference = (startDate, endDate) => {
  const msInHour = 1000 * 60;

  return Math.round(Math.abs(endDate - startDate) / msInHour);
}

module.exports = {
  getAll,
  getAllReservationCount,
  getSingle,
  createPost,
  deleteReservation,
  updateReservation,
  getReservedStylishIds,
  getReservationByReservationDetails,
  getThisWeekReservationIds,
  getCompletedReservationCount,
  updateReservationStatus,
  updateReservationDateForDragDrop,
  isInThePast,
  getSpecificFieldsById,
  getTimeDifference
}
