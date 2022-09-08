const { getAll, createPost } = require('../services/reservationService');
const { objectIdValider } = require('../services/objectIdValiderService');

//get all Reservation
const reservationGetAll = async (req, res) => {
    try {
        const result = await getAll()
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving user information" })
    }
}

//Reservation create post API call (Save form data in db)
const reservationCreatePost = async (req, res) => {

    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

     try {

        const reservation = req.body;

        objectIdValider(reservation.client, 'client');
        objectIdValider(reservation.stylist, 'stylist');
        
        const result = await createPost(reservation)
        res.send(result)

    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message || "Error Update user information"})
    }  
}

module.exports = {
    reservationCreatePost,
    reservationGetAll
}
