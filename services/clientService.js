const Client = require('../models/client');

//get all Clients service
const getAll = async (params) => {
    // return Client.find().sort({ createdAt: -1 })
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
    const client = Client.collection.find(filters)

    const resultCount = await client.count();

    if (perPage) {
        console.log("ParamsPageee", params?.page || 1);
        client.limit(perPage * 1)
    }
    if (page) {
        client.skip(perPage * (page - 1))
    }
    return {data : await client.toArray(), count: resultCount}
}

//All Client Count
const getAllClientCount = () => {
    return Client.countDocuments();
}

//get single Client Service
const getSingle = (id) => {
    return Client.findById(id)
}

//get Client by Email
const getClientByEmail = (email) => {
    return Client.findOne({
        email : email
    })
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
    updateClient,
    getClientByEmail
}