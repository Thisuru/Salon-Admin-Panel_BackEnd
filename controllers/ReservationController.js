const { getAll, getAllReservationCount, getSingle, createPost, deleteReservation, updateReservation } = require('../services/reservationService');
const { objectIdValider } = require('../services/objectIdValiderService');
const Reservation = require('../models/reservation');

//get all Reservation
const reservationGetAll = async (req, res) => {
    try {
        const currentPage = req.query.page
        const reservations = await getAll(currentPage)
        const totalPages = await getAllReservationCount();

        const response = {
            reservations : reservations.map(reservation => ({
                id: reservation._id, 
                client: reservation.client,
                service: reservation.service,
                stylist:reservation.stylist,
                startTime: reservation.startTime,
                endTime: reservation.endTime,
                status: reservation.status
            })),
            totalPages,
            currentPage
        }

        res.send(response)

    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving user information" })
    }
}

//get the selected reservation based on Params id 
const reservationGetSingle = async (req, res) => {

    try {
        const id = req.params.id;
        const result = await getSingle(id)
        if(!result){
            res.status(404).send({ message:`Not found user with id ${id}`})
        } else {
            res.send(result)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: `Erro retrieving user with id= ${id}`})
    }
}

//Reservation create post API call (Save form data in db)
const reservationCreatePost = async (req, res) => {

    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

     try {

        const reqBody = req.body;

        objectIdValider(reqBody.client, 'client');
        objectIdValider(reqBody.stylist, 'stylist');
        
        const result = await createPost(reqBody)
        res.send(result)

    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message || "Error Update user information"})
    }  
}

//delete selected Reservation 
const reservationDelete = async (req, res) => {

    try {
        const id = req.params.id;
        const result = await deleteReservation(id)
        if(!result){
            res.status(404).send({ message:`Cannot Delete reservation with ${id}. Maybe user not found!`})
        } else {
            res.send({ message: "Reservation was deleted successfully!"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: `Could not delete reservation with id= ${id}`})
    }
}

//update selected Reservation
const reservationUpdate = async (req, res) => {
    // if(!res.body){
    //     return res.status(400).send({message: 'Data to update can not be empty'})
    // }
    console.log("Req body reservation: ", req.body)

    try {
        const id = req.params.id;
        // const result = await Client.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        const result = await Reservation.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        if(!result){
            res.status(404).send({ message:`Cannot Update user with ${id}. Maybe user not found!`})
        } else {
            res.send(result)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error Update user information"})
    }
}

module.exports = {
    reservationCreatePost,
    reservationGetAll,
    reservationGetSingle,
    reservationDelete,
    reservationUpdate
}
