const Stylist = require('../models/stylist');
const { getReservedStylishIds } = require("../services/reservationService");
const { getAvailableFromResevedIds } = require("../services/stylishService");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
    
//get all Stylists
const userLogin = async (req, res) => {
    try {
        const result = await Stylist.find().sort({ createdAt: -1 })
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || "Error Occurred while retriving user information" })
    }
}

//Stylists create post API call (Save form data in db)
const userRegister = async (req, res) => {
    
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);
       
        res.json({ status: false, message: "User has been saved" });

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }

}

module.exports = {
    UserLogin,
    stylistCreatePost,
}