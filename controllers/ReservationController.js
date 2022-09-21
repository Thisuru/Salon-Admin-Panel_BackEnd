const { getAll, 
        getAllReservationCount, 
        getCompletedReservationCount, 
        getSingle, 
        createPost, 
        deleteReservation, 
        updateReservation, 
        updateReservationStatus,
        updateReservationDateForDragDrop
       } = require('../services/reservationService');

const { objectIdValider } = require('../services/objectIdValiderService');
const Reservation = require('../models/reservation');

//get all Reservation
const reservationGetAll = async (req, res) => {
    try {
        // const currentPage = req.query.page
        const params = req.query
        const {data} = await getAll(params)
        const totalPages = await getAllReservationCount();

        const response = {
            reservations : data.map(reservation => ({
                id: reservation._id, 
                client: reservation.client,
                service: reservation.service,
                stylist:reservation.stylist,
                startTime: reservation.startTime,
                endTime: reservation.endTime,
                status: reservation.status
            })),
            totalPages,
            currentPage : params?.page
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

//get all reservation count
const getAllReservationCountController  = async (req, res) => {
    try {
        const totalReservations = await getAllReservationCount();
        const response = {
            totalCount : totalReservations
        }
        console.log("Reservation count: ", totalReservations);
        res.send(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving reservation information" })
    }
}

//get completed Reservation Count
const getCompletedReservationCountController  = async (req, res) => {
    try {
        const completedReservations = await getCompletedReservationCount();
        const response = {
            completedCount : completedReservations
        }
        console.log("Completed Reservation count: ", completedReservations);
        res.send(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving reservation information" })
    }
}

//Update Reservation status by admin
const updateStatus = async (req, res) => {
    console.log("STATUS: ", req.body);
    const status = req.body.status;
    const id = req.body.id;
  
    // if (!reservationStatus.includes(status)) {
    //   res.status(400).send({ message: "Invalid status!" });
    //   return;
    // }
  
    const result = await updateReservationStatus(status, id);
  
    if (result == null) {
      res.status(200).send({ message: "Reservation status is failed" });
      return;
    }
  
    res
      .status(200)
      .send({ message: "Reservation status is updated", data: result });
  };

  //Update Reservation date by admin
const updateReservationByCalendarDragDrop = async (req, res) => {
    console.log("Calendar Drag drop: ", req.body);
    const id = req.body.id;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime
  
    const result = await updateReservationDateForDragDrop(startTime, endTime, id);
  
    if (result == null) {
      res.status(203).send({ message: "Reservation Date update is failed" });
      return;
    }
  
    res
      .status(200)
      .send({ message: "Reservation date is updated", data: result });
  };

module.exports = {
    reservationCreatePost,
    reservationGetAll,
    reservationGetSingle,
    reservationDelete,
    updateStatus,
    reservationUpdate,
    getAllReservationCountController,
    getCompletedReservationCountController,
    updateReservationByCalendarDragDrop
}
