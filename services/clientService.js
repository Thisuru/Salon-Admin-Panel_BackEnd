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
// const createPost = (requestBody) => {
//     return client.save(requestBody)
// }

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
    deleteClient,
    updateClient
}