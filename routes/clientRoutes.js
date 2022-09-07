const express = require('express');
const ClientController = require('../controllers/ClientController');

const router = express.Router();

router.get('/', ClientController.client_get_all);
router.post('/', ClientController.client_create_post)
router.get('/:id', ClientController.client_get_singleClient);
router.delete('/:id', ClientController.client_delete)

module.exports = router;