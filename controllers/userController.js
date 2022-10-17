const { createUser,
    getUserByUsername,
    getAll,
    deleteUser,
    getUserByEmail,
    updateUser,
    getSingle,
    updatePassword
} = require("../services/userService");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_decode = require('jwt-decode');
const { userServerError } = require('../util/errorHandler/userServerError');

//User Login
const userLogin = async (req, res) => {

    const { username, password } = req.body;
    // const [user] = await mysqldb.query(`SELECT Name,Password FROM user WHERE Name ='${username}'`);
    const user = await getUserByUsername(username);

    if (!user) {
        return res.status(203).json({ status: false, message: 'Sorry you do not have an account' });
    }

    const is_authnticted = await bcrypt.compare(password, user.password);

    if (!is_authnticted) {
        return res.status(203).json({ status: false, message: 'Your user name or password incorrect' });
    }
    const maxAge = 1 * 24 * 60 * 60;
    const accessToken = jwt.sign({ user: user.username }, process.env.SECRET_KEY, { expiresIn: maxAge });

    //return res.header('auth-token', accessToken).send(accessToken);
    return res.status(200).json({ status: true, username: user.username, token: accessToken });

}

//User Register
const userRegister = async (req, res) => {

    const { firstname, lastname, username, phone, email, password, confirmpassword } = req.body;

    try {

        if (confirmpassword !== password) {

            res.status(203).send({ status: false, message: "Password & Confirm Password does not match!" })

        } else {
            const user = await getUserByUsername(username);

            if (user) {
                return res.status(203).json({ status: false, message: 'This user is already registered' });
            }

            // const salt = await bcrypt.genSalt()
            // const hashedPassword = await bcrypt.hash(password, salt);

            const userData = {
                firstname: firstname,
                lastname: lastname,
                username: username.trim(),
                phonenumber: phone,
                email: email,
                password: password
            }
            const result = await createUser(userData)

            res.json({ status: true, message: "User has been saved" });
        }

    } catch (error) {
        const errors = { firstname : '', lastname: '', username: '', phonenumber: '', email: '', password: '' };
        
        userServerError(error, errors, 'User', res)
        // res.status(400).json({ status: false, error: err });
    }

}

//get all Admin Users
const userGetAll = async (req, res) => {
    try {
        const params = req.query
        const { data, count } = await getAll(params)
        console.log("userGetAll data: ", data);
        const response = {
            users: data.map(user => ({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username, 
                phonenumber: user.phonenumber,
                email: user.email
            }
            )),
            totalPages: count,
            currentPage: params?.page
        }

        res.send(response)
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred while retriving user information" })
    }
}

//delete selected User 
const userDelete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await deleteUser(id)
        if (!result) {
            res.status(404).send({ message: `Cannot Delete user with ${id}. Maybe user not found!` })
        } else {
            res.send({ message: "User was deleted successfully!" })
        }
    } catch (error) {
        res.status(500).send({ message: `Could not delete User with id= ${id}` })
    }
}

//update selected User
const userUpdate = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await getUserByEmail(req.body.email)
        
        if (user && (id != user.id)) {
            return res.status(203).json({
                status: false,
                message: 'This email is already in use.'
            });
        } else {
            const result = await updateUser(id, req.body)

            if (!result) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(result)
            }
        }

    } catch (error) {
        res.status(500).send({ message: "Error Update user information" })
    }
}

//get the selected Admin User based on Params id 
const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await getSingle(id)
        if (!result) {
            res.status(404).send({ message: `Not found user with id ${id}` })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).send({ message: `Erro retrieving user with id= ${id}` })
    }
}

//Decode register token and check user availability
const decodeTokenCheckAvailability = async (req, res) => {

    try {

        var token = req.body.token;
        var decoded = jwt_decode(token);
        
        const user = await getUserByEmail(decoded.email)

        if (user) {
            return res.status(203).json({
                status: false,
                message: 'User is already Signed Up'
            });
        } else {
            res.send(decoded)
        }

    } catch (error) {
        res.status(500).send({ message: "Error Decoding the admin user information" })
    }

}

//Decode register token and check user availability
const decodeTokenByUsername = async (req, res) => {

    try {

        var token = req.body.token;
        var decoded = jwt_decode(token);

        const user = await getUserByUsername(decoded.user)

        if (!user) {
            return res.status(203).json({
                status: false,
                message: 'User is not logged in!'
            });
        } else {
            res.send(user)
        }

    } catch (error) {
        res.status(500).send({ message: "Error Decoding the admin user information" })
    }

}

//update selected User
const userPasswordReset = async (req, res) => {
    const id = req.params.id;

    try {
        const { password, confirmpassword } = req.body;

        if (confirmpassword !== password) {
            res.status(203).send({ message: "Password & Confirm Password does not match!" })

        } else {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt);

            const userData = {
                id: id,
                password: hashedPassword
            }
            const result = await updatePassword(userData)

            res.json({ status: true, message: "User password has been changed" });
        }

    } catch (error) {
        res.status(500).send({ message: "Error Update user information" })
    }
}


module.exports = {
    userLogin,
    userRegister,
    userGetAll,
    userDelete,
    userUpdate,
    getSingleUser,
    decodeTokenCheckAvailability,
    decodeTokenByUsername,
    userPasswordReset
}