const Stylist = require('../models/stylist');
const { getReservedStylishIds, getThisWeekReservationIds, getSpecificFieldsById } = require("../services/reservationService");
const { getAvailableFromResevedIds, getSingle } = require("../services/stylishService");
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

const getEachStylistTimePerWeek = async (req, res) => {
    try {

        const thisWeekReservations = await getThisWeekReservationIds();
        console.log("thisWeekReservationsIds: ", thisWeekReservations);
        let getSingleReservation = []

        for (let i = 0; i < thisWeekReservations.length; i++) {

            let reservation = await getSpecificFieldsById(thisWeekReservations[i]);
            // console.log("reservation: ", reservation);
            getSingleReservation.push(reservation)
        }

        console.log("FINAL: ", getSingleReservation);
        res.send(getSingleReservation)

    } catch (error) {
        res
            .status(500)
            .send({ message: error.message || "Error Occurred while retriving stylist information" });
    }
}

//get the selected Stylist based on Params id 
const getStylistNameById = async (req, res) => {

    try {
        const id = req.params.id;
        const result = await getSingle(id)

        if (!result) {
            res.status(404).send({ message: `Not found user with id ${id}` })
        } else {
            res.send(result)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Erro retrieving user with id= ${id}` })
    }
}


module.exports = {
    stylistGetAll,
    stylistCreatePost,
    getAvailableStylish,
    getEachStylistTimePerWeek,
    getStylistNameById
}