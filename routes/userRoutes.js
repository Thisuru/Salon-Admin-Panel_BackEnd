const express = require('express');
const { userLogin, userRegister, userGetAll, userDelete, userUpdate, getSingleUser } = require('../controllers/userController');
const { route } = require('./clientRoutes');

const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/', userGetAll)
router.get('/:id', getSingleUser);
router.delete('/:id', userDelete);
router.put('/:id', userUpdate);

module.exports = router;