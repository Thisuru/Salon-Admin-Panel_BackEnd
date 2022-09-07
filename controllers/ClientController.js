const Client = require('../models/client');

//get all Clients
const client_get_all = async (req, res) => {
    try {
        const result = await Client.find().sort({ createdAt: -1 })
        res.send(result)
    } catch (error) {
        console.log(error);
    }
}

//get the selected Client based on Params id 
const client_get_singleClient = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Client.findById(id)
        res.send(result)
    } catch (error) {
        console.log(error);
    }
}

//Client create post API call (Save form data in db)
const client_create_post = async (req, res) => {
    const client = new Client(req.body);

     try {
        const result = await client.save()
        res.send(result)
    } catch (error) {
        console.log(error);
    }
}

//delete selected Client 
const client_delete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Client.findByIdAndDelete(id)
        res.send(result)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    client_get_all,
    client_get_singleClient,
    client_create_post,
    client_delete
}