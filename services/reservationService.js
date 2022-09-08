const { Types } = require('mongoose');
const Reservation = require('../models/reservation');

//get all Reservation
const getAll = () => {
    return Reservation.find().populate('client').populate('stylist')
}

//Reservation create post API call (Save form data in db)
const reservationCreatePost = async (req, res) => {

    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

     try {

        const reservation = req.body;

        if(!Types.ObjectId.isValid(reservation.client)) {
            throw new Error('client object id not passed')
        }

        const result = await Reservation.create(reservation)
        res.send(result)

    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message || "Error Update user information"})
    }  
}

module.exports = {
    reservationCreatePost,
    getAll
}
