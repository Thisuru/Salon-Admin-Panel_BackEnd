const Stylist = require('../models/stylist');
const { getReservedStylishIds, getReservationByReservationDetails } = require("../services/reservationService");
const { getAvailableFromResevedIds } = require("../services/stylishService");
var moment = require('moment');

//get all Stylists
const stylistGetAll = async (req, res) => {
    try {
        const result = await Stylist.find().sort({ createdAt: -1 })
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || "Error Occurred while retriving user information" })
    }
}

//Stylists create post API call (Save form data in db)
const stylistCreatePost = async (req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    try {
        const client = new Stylist({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phonenumber: req.body.phonenumber,
            email: req.body.email
        });

        const result = await client.save(client)
        res.send(result)

    } catch (error) {
        node
        console.log(error);
        res.status(500).send({ message: error.message || "Error Update user information" })
    }
}

const getAvailableStylish = async (req, res) => {
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
        res
            .status(500)
            .send({ message: error.message || "Error Occurred while retriving user information" });
    }
};

const getEachStylistTimePerDay = async (req, res) => {
    try {
        // const currentDate = new Date().toISOString();

        function addHours(numOfHours, date = new Date()) {
            date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
          
            return date;
          }
          
        //   const result = addHours(1);
        //   const endDate = result.toISOString()
          
        //   console.log("Current Date + 1hr: ", result)
        //   console.log("Current Date Moment ", moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'));
        //   console.log("Current Date + 1hr Moment ", moment(result).format('MMMM Do YYYY, h:mm:ss a'));
        //   console.log("Current Date + 1hr in ISO: ", result.toISOString())
        //   console.log("CurrentDate: ", currentDate);

        let start = '2022-09-30T02:30:00.072Z'
        let end = '2022-09-30T11:30:00.072Z'

        const resevedReservationIds = await getReservationByReservationDetails(start, end);

        res.send(resevedReservationIds)
    } catch (error) {
        res
            .status(500)
            .send({ message: error.message || "Error Occurred while retriving user information" });
    }
}


module.exports = {
    stylistGetAll,
    stylistCreatePost,
    getAvailableStylish,
    getEachStylistTimePerDay
}