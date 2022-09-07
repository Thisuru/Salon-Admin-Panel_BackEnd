const Client = require('../models/client');

//get all Clients
const clientGetAll = async (req, res) => {
    try {
        const result = await Client.find().sort({ createdAt: -1 })
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving user information" })
    }
}

//get the selected Client based on Params id 
const clientGetSingleClient = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Client.findById(id)
        if(!result){
            res.status(404).send({ message:`Not found user with id ${id}`})
        } else {
            res.send(result)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: `Erro retrieving user with id= ${id}`})
    }
}

//Client create post API call (Save form data in db)
const clientCreatePost = async (req, res) => {

    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

    const client = new Client({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        email: req.body.email
    });

     try {
        const result = await client.save(client)
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message || "Error Update user information"})
    }  
}

//delete selected Client 
const clientDelete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Client.findByIdAndDelete(id)
        if(!result){
            res.status(404).send({ message:`Cannot Update user with ${id}. Maybe user not found!`})
        } else {
            res.send({ message: "User was deleted successfully!"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: `Could not delete User with id= ${id}`})
    }
}

//update selected client
const clientUpdate = async (req, res) => {
    if(!res.body){
        return res.status(400).send({message: 'Data to pdate can not be empty'})
    }

    const id = req.params.id;

    try {
        const result = await Client.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        if(!result){
            res.status(404).send({ message:`Cannot Update user with ${id}. Maybe user not found!`})
        } else {
            res.send(result)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error Update user information"})
    }
}

module.exports = {
    clientGetAll,
    clientGetSingleClient,
    clientCreatePost,
    clientDelete,
    clientUpdate
}