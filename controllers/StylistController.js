const Stylist = require('../models/stylist');
const { getReservedStylishIds, getThisWeekReservationIds, getSpecificFieldsById, getTimeDifference } = require("../services/reservationService");
const { getAvailableFromResevedIds, getSingle } = require("../services/stylishService");
var moment = require('moment');
const catchAsync = require('../util/errorHandler/catchAsync');
const AppError = require('../util/errorHandler/appError');

//get all Stylists
const stylistGetAll = catchAsync(async (req, res, next) => {
    const result = await Stylist.find().sort({ createdAt: -1 })
    res.send(result)
})

//Stylists create post API call (Save form data in db)
const stylistCreatePost = catchAsync(async (req, res) => {
    const client = new Stylist({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        email: req.body.email
    });
    const result = await client.save(client)
    res.send(result)
})

const getAvailableStylish = async (req, res, next) => {
    try {
        const start = new Date(req.body.start); //"2022-09-18T09:15:55.970Z"
        const end = new Date(req.body.end); //"2022-09-18T09:15:55.970Z"

        const resevedStylishIds = await getReservedStylishIds(start, end);

        console.log(resevedStylishIds);

        const availabelStylish = await getAvailableFromResevedIds(
            resevedStylishIds
        );

        res.send({ availabelStylish, resevedStylishIds });
    } catch (error) {
        next(error)
    }
};

const getEachStylistTimePerWeek = async (req, res) => {
    try {

        const thisWeekReservations = await getThisWeekReservationIds();
        console.log("thisWeekReservationsIds: ", thisWeekReservations);
        let middleReservationObj = {};
        let getSingleReservation = [];

        for (let i = 0; i < thisWeekReservations.length; i++) {

            let reservation = await getSpecificFieldsById(thisWeekReservations[i]);
            let start = reservation[0].startTime;
            let end = reservation[0].endTime
            let minutesDifference = getTimeDifference(start, end);

            middleReservationObj.name = reservation[0].stylists.firstname
            middleReservationObj.WeeklyTimeInMins = minutesDifference

            getSingleReservation.push(middleReservationObj)
            middleReservationObj = {}
        }

        console.log("FINAL: ", getSingleReservation);

        var holder = {};

        getSingleReservation.forEach(function (d) {
            if (holder.hasOwnProperty(d.name)) {
                holder[d.name] = holder[d.name] + d.WeeklyTimeInMins;
            } else {
                holder[d.name] = d.WeeklyTimeInMins;
            }
        });

        var barchartReservationData = [];

        for (var prop in holder) {
            barchartReservationData.push({ name: prop, WeeklyTimeInMins: holder[prop] });
        }

        console.log(barchartReservationData);

        res.send(barchartReservationData)

    } catch (error) {
        next(error)
    }
}

//get the selected Stylist based on Params id 
const getStylistNameById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await getSingle(id)

    if (!result) {
        throw new AppError('User not found!', 404);
    } else {
        res.send(result)
    }
})

module.exports = {
    stylistGetAll,
    stylistCreatePost,
    getAvailableStylish,
    getEachStylistTimePerWeek,
    getStylistNameById
}