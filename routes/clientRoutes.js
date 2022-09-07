const express = require('express');
const ClientController = require('../controllers/ClientController');

const router = express.Router();

router.get('/', ClientController.clientGetAll);
router.post('/', ClientController.clientCreatePost)
router.get('/:id', ClientController.clientGetSingleClient);
router.put('/:id', ClientController.clientUpdate);
router.delete('/:id', ClientController.clientDelete);

module.exports = router;