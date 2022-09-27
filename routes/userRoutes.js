const express = require('express');
const { userLogin, userRegister, userGetAll, userDelete } = require('../controllers/userController');
const { route } = require('./clientRoutes');

const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/', userGetAll)
router.delete('/:id', userDelete);

module.exports = router;