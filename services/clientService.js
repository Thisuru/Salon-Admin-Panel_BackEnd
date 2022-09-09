const Client = require('../models/client');

//get all Clients service
const getAll = () => {
    return Client.find().sort({ createdAt: -1 })
}

//get single Client Service
const getSingle = (id) => {
    return Client.findById(id)
}

//Reservation create post API call service
const createPost = (requestBody) => {

    const client = new Client({
        firstname: requestBody.firstname,
        lastname: requestBody.lastname,
        phonenumber: requestBody.phonenumber,
        email: requestBody.email
    });

    return Client.create(client)
}

//Delete Client Service
const deleteClient = (id) => {
    return Client.findByIdAndDelete(id)
}

//update Client Service
const updateClient = (id, reqBody) => {
    return Client.findByIdAndUpdate(id, reqBody, { useFindAndModify: false})
}

module.exports = {
    getAll,
    getSingle,
    createPost,
    deleteClient,
    updateClient
}