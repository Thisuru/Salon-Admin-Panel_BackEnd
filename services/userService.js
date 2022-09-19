const User = require('../models/user');


//Reservation create post API call service
const createUser = (userData) => {

    // const user = new User(userData);

    return User.create(userData);
}

//authenticate user
const getUserByUsername = (username) => {
    return User.findOne({
        username : username
    })
}

module.exports = {
    createUser,
    getUserByUsername
}   