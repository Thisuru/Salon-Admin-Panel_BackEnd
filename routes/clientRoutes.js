const express = require('express');
const { clientGetAll, clientCreatePost, clientGetSingleClient, clientUpdate, clientDelete } = require('../controllers/ClientController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, clientGetAll);
router.post('/', clientCreatePost)
router.get('/:id', clientGetSingleClient);
router.put('/:id', clientUpdate);
router.delete('/:id', clientDelete);

module.exports = router;