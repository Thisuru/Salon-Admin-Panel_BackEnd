const Client = require('../models/client');
const { getAll, getSingle, deleteClient, createPost, updateClient } = require('../services/clientService');

//get all Clients
const clientGetAll = async (req, res) => {
    try {
        const params = req.query
        const {data, count} = await getAll(params)

        console.log("data1: ", data);
        const response = {
            clients : data.map(client => ({
                id: client._id, 
                firstname: client.firstname, 
                lastname: client.lastname, 
                phonenumber: client.phonenumber, 
                email: client.email}
                )),
            totalPages : count,
            currentPage : params?.page
        }

        res.send(response)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : error.message || "Error Occurred while retriving user information" })
    }
}

//get the selected Client based on Params id 
const clientGetSingleClient = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await getSingle(id)
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

     try {
        const result = await createPost(req.body)
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
        const result = await deleteClient(id)
        if(!result){
            res.status(404).send({ message:`Cannot Delete user with ${id}. Maybe user not found!`})
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
    // if(!res.body){
    //     return res.status(400).send({message: 'Data to update can not be empty'})
    // }
    console.log("Req body: ", req.body)
    const id = req.params.id;

    try {
        // const result = await Client.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
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