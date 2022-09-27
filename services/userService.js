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
    let filters = {}

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

    const page = Math.max(0, params?.page || 1)
    const perPage = 30;
    const user = User.collection.find(filters)

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


module.exports = {
    createUser,
    getUserByUsername,
    getAll,
    deleteUser
}   