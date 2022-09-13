const { getAll, getAllReservationCount, getSingle, createPost, deleteReservation } = require('../services/reservationService');
const { objectIdValider } = require('../services/objectIdValiderService');

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

module.exports = {
    reservationCreatePost,
    reservationGetAll,
    reservationGetSingle,
    reservationDelete
}
