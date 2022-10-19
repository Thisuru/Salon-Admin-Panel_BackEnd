const { getAll,
    getAllReservationCount,
    getCompletedReservationCount,
    getSingle,
    createPost,
    deleteReservation,
    updateReservation,
    updateReservationStatus,
    updateReservationDateForDragDrop,
    getReservationByReservationDetails,
    isInThePast
} = require('../services/reservationService');

const { objectIdValider } = require('../services/objectIdValiderService');
const Reservation = require('../models/reservation');
const catchAsync = require('../util/errorHandler/catchAsync');
const AppError = require('../util/errorHandler/appError');

//get all Reservation
const reservationGetAll = catchAsync(async (req, res) => {
    const params = req.query
    const { data } = await getAll(params)
    const totalPages = await getAllReservationCount();

    const response = {
        reservations: data.map(reservation => ({
            id: reservation._id,
            client: reservation.clients,
            service: reservation.service,
            stylist: reservation.stylists,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            status: reservation.status
        })),
        totalPages,
        currentPage: params?.page
    }

    res.send(response)
})

//get the selected reservation based on Params id 
const reservationGetSingle = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await getSingle(id)
    if (!result) {
        throw new AppError('User not Found!.', 404);
    } else {
        res.send(result)
    }
})

//Reservation create post API call (Save form data in db)
const reservationCreatePost = catchAsync(async (req, res, next) => {
        const reqBody = req.body;
        objectIdValider(reqBody.client, 'client');
        objectIdValider(reqBody.stylist, 'stylist');

        const result = await createPost(reqBody)
        res.send(result)
})

//delete selected Reservation 
const reservationDelete = async (req, res) => {

    try {
        const id = req.params.id;
        const result = await deleteReservation(id)
        if (!result) {
            res.status(404).send({ message: `Cannot Delete reservation with ${id}. Maybe user not found!` })
        } else {
            res.send({ message: "Reservation was deleted successfully!" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Could not delete reservation with id= ${id}` })
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
        const result = await Reservation.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        if (!result) {
            res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
        } else {
            res.send(result)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error Update user information" })
    }
}

//get all reservation count
const getAllReservationCountController = async (req, res) => {
    try {
        const totalReservations = await getAllReservationCount();
        const response = {
            totalCount: totalReservations
        }
        console.log("Reservation count: ", totalReservations);
        res.send(response)

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || "Error Occurred while retriving reservation information" })
    }
}

//get completed Reservation Count
const getCompletedReservationCountController = async (req, res) => {
    try {
        const completedReservations = await getCompletedReservationCount();
        const response = {
            completedCount: completedReservations
        }
        console.log("Completed Reservation count: ", completedReservations);
        res.send(response)

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || "Error Occurred while retriving reservation information" })
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
    const NewStartTime = req.body.NewStartTime;
    const NewEndTime = req.body.NewEndTime
    const stylist = req.body.stylist

    try {
        const dropedDateInThePast = isInThePast(NewStartTime);
        console.log("dropedDateInThePast: ", dropedDateInThePast);

        if (!dropedDateInThePast) {
            const reservation = await getReservationByReservationDetails(NewStartTime, NewEndTime)

            const alreadyAvailableReservations = [];

            for (let i in reservation) {
                const result = await getSingle(reservation[i])

                if (stylist === result.stylist.toString()) {
                    alreadyAvailableReservations.push(result._id)
                }
            }

            console.log("alreadyAvailableReservations: ", alreadyAvailableReservations);

            if (alreadyAvailableReservations.length > 0) {
                console.log("Reservation is already available on this date");
                return res.status(203).json({
                    status: false,
                    message: 'Reservation is already available on this date'
                });

            } else {

                const result = await updateReservationDateForDragDrop(NewStartTime, NewEndTime, id, stylist);

                if (result == null) {
                    res.status(203).send({ message: "Reservation Date update is failed" });
                    return;
                }
                res
                    .status(200)
                    .send({ message: "Reservation date is updated", data: result });
            }
        } else {
            return res.status(203).json({
                status: false,
                message: 'Unable to place a reservation on a past date!'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || "Error Occurred while Drag & dropping the reservation!" })
    }


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
