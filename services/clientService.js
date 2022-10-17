const Client = require('../models/client');

//get all Clients service
const getAll = async (params) => {
    // return Client.find().sort({ createdAt: -1 })

    // const sort = params?.sort
    // const page = Math.max(0, params?.page || 1)
    // const perPage = params?.limit;

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
        // const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        // const searchRgx = rgx(params.search);

        filters.$or = [
            { firstname: { $regex: params.search } },
            { lastname: { $regex: params.search } },
            { phonenumber: { $regex: params.search } },
            { email: { $regex: params.search } }
        ]
    }

    const client = Client.collection.find(filters).sort({ ...sortQuery })

    const resultCount = await client.count();

    if (perPage) {
        console.log("ParamsPageee", params?.page || 1);
        client.limit(perPage * 1)
    }
    if (page) {
        client.skip(perPage * (page - 1))
    }
    return { data: await client.toArray(), count: resultCount }
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
        email: email
    })
}

//Reservation create post API call service
const createPost = ({ firstname, lastname, phonenumber, email}) => {

    const client = new Client({
        firstname: firstname,
        lastname: lastname,
        phonenumber: phonenumber,
        email: email
    });

    return Client.create(client)
}

//Delete Client Service
const deleteClient = (id) => {
    return Client.findByIdAndDelete(id)
}

//Update Client
const updateClient = (id, reqBody) => {
    return Client.findByIdAndUpdate(id,
        {
            firstname: reqBody.firstname,
            lastname: reqBody.lastname,
            email : reqBody.email,
            phonenumber: reqBody.phone,
        },
        { useFindAndModify: false })
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