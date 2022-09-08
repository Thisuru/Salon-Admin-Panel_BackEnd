const Stylist = require('../models/stylist');

//get all Stylists
const stylistGetAll = async (req, res) => {
    try {
        const result = await Stylist.find().sort({ createdAt: -1 })
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving user information" })
    }
}

//Stylists create post API call (Save form data in db)
const stylistCreatePost = async (req, res) => {

    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
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
        res.status(500).send({message: error.message || "Error Update user information"})
    }  
}


module.exports = {
    stylistGetAll,
    stylistCreatePost
}