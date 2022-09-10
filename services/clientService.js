const Client = require('../models/client');

//get all Clients service
const getAll = (paramsPage) => {
    // return Client.find().sort({ createdAt: -1 })

    const page = Math.max(0, paramsPage)
    const perPage = 30;
    const client = Client.find()

    if (perPage) {
        console.log("PErpage", perPage);
        console.log("ParamsPageee", paramsPage);
        client.limit(perPage* 1)
    }
    if (page) {
        client.skip(perPage * (page-1))
    }
    return client.exec()
}

//All Client Count
const getAllClientCount = () => {
    return Client.countDocuments();
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
    return Client.findByIdAndUpdate(id, reqBody, { useFindAndModify: false })
}

module.exports = {
    getAll,
    getSingle,
    getAllClientCount,
    createPost,
    deleteClient,
    updateClient
}