const express = require('express');
const { userLogin, userRegister, userGetAll } = require('../controllers/userController');
const { route } = require('./clientRoutes');

const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/', userGetAll)

module.exports = router;