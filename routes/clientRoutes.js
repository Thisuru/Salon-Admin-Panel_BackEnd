const express = require('express');
const router = express.Router();
const Client = require('../models/client');

//get all Clients
router.get('/', async (req, res) => {

    try {
        const result = await Client.find().sort({ createdAt: -1 })
        res.send(result)
    } catch (error) {
        console.log(error);
    }
})

//Client create post API call (Save form data in db)
router.post('/', async (req, res) => {
    const client = new Client(req.body);

     try {
        const result = await client.save()
        res.send(result)
    } catch (error) {
        console.log(error);
    }
})

//get API (render the details page based on params id)

module.exports = router;