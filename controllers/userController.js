const Stylist = require('../models/stylist');
const { createUser, getUserByUsername } = require("../services/userService");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//get all Stylists
const userLogin = async (req, res) => {

    const { username, password } = req.body;
    // const [user] = await mysqldb.query(`SELECT Name,Password FROM user WHERE Name ='${username}'`);
    const user = await getUserByUsername(username);

    if (!user) {
        return res.status(200).json({ status: false, message: 'Sorry you do not have an account' });
    }

    const is_authnticted = await bcrypt.compare(password, user.password);

    if (!is_authnticted) {
        return res.status(200).json({ status: false, message: 'Your user name or password incorrect' });
    }
    const accessToken = jwt.sign({ user: user.Name }, process.env.SECRET_KEY);

    //return res.header('auth-token', accessToken).send(accessToken);
    return res.status(200).json({ status: true, username: user.Name, token: accessToken });

}

//Stylists create post API call (Save form data in db)
const userRegister = async (req, res) => {

    try {
        const { username, password } = req.body;

        const user = await getUserByUsername(username);

        if (user) {
            return res.status(200).json({ status: false, message: 'Aleady Registered' });
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            username: username.trim(),
            password: hashedPassword
        }
        const result = await createUser(userData)

        res.json({ status: true, message: "User has been saved" });

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }

}


module.exports = {
    userLogin,
    userRegister
}