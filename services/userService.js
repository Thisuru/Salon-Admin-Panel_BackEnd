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

//get all Admin Users service
const getAll = async (params) => {

    const sort = 'OLDEST'
    const page = Math.max(0, params?.page || 1)
    const perPage = 30;

    let sortQuery = {};
    let filters = {}

    if (sort == 'NEWEST') {
        sortQuery = {
            _id: -1,
        };
    }

    if (sort == 'OLDEST') {
        sortQuery = {
            _id: 1,
        };
    }

    if (params?.search) {
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRgx = rgx(params.search);

        filters.$or = [
            { firstname: { $regex: searchRgx, $options: "i" } },
            { lastname: { $regex: searchRgx, $options: "i" } },
            { phonenumber: { $regex: searchRgx, $options: "i" } },
            { email: { $regex: searchRgx, $options: "i" } }
        ]
    }
    
    const user = User.collection.find(filters).sort({ ...sortQuery })

    const resultCount = await user.count();

    if (perPage) {
        console.log("ParamsPageee", params?.page || 1);
        user.limit(perPage * 1)
    }
    if (page) {
        user.skip(perPage * (page - 1))
    }
    return {data : await user.toArray(), count: resultCount}
}

//Delete User Service
const deleteUser = (id) => {
    return User.findByIdAndDelete(id)
}

//get User by Email
const getUserByEmail = (email) => {
    console.log("EMAIL: ", email);
    return User.findOne({
        email : email
    })
}

//Update User
const updateUser = (id, reqBody) => {
    return User.findByIdAndUpdate(id,
        {
            firstname: reqBody.firstname,
            lastname: reqBody.lastname,
            username : reqBody.username,
            email : reqBody.email,
            phonenumber: reqBody.phonenumber,
        },
        { useFindAndModify: false })
}

//Update User
const updatePassword = (userData) => {
    return User.findByIdAndUpdate(userData.id, { password: userData.password }, { useFindAndModify: false })
}

//get single User Service
const getSingle = (id) => {
    return User.findById(id)
}

module.exports = {
    createUser,
    getUserByUsername,
    getAll,
    deleteUser,
    getUserByEmail,
    updateUser,
    getSingle,
    updatePassword
}   