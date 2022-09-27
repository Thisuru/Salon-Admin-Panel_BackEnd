const { createUser, getUserByUsername, getAll, deleteUser } = require("../services/userService");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//get all Stylists
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
    const accessToken = jwt.sign({ user: user.Name }, process.env.SECRET_KEY);

    //return res.header('auth-token', accessToken).send(accessToken);
    return res.status(200).json({ status: true, username: user.Name, token: accessToken });

}

//Stylists create post API call (Save form data in db)
const userRegister = async (req, res) => {

    try {
        console.log("Register body: ", req.body);
        const { firstname, lastname, username, phone, email, password } = req.body;

        const user = await getUserByUsername(username);

        if (user) {
            return res.status(203).json({ status: false, message: 'This user is already registered' });
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            firstname: firstname,
            lastname: lastname,
            username: username.trim(),
            phonenumber: phone,
            email : email,
            password: hashedPassword
        }
        const result = await createUser(userData)
        console.log("Result: ", result);

        res.json({ status: true, message: "User has been saved" });

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }

}

//get all Admin Users
const userGetAll = async (req, res) => {
    try {
        const params = req.query
        const { data, count } = await getAll(params)

        console.log("userGetAll: ", data);
        const response = {
            users: data.map(user => ({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                phonenumber: user.phonenumber,
                email: user.email
            }
            )),
            totalPages: count,
            currentPage: params?.page
        }

        res.send(response)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || "Error Occurred while retriving user information" })
    }
}

//delete selected Client 
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
        console.log(error);
        res.status(500).send({ message: `Could not delete User with id= ${id}` })
    }
}


module.exports = {
    userLogin,
    userRegister,
    userGetAll,
    userDelete
}