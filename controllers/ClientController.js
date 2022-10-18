const { getAll,
    getSingle,
    deleteClient,
    createPost,
    updateClient,
    getClientByEmail
} = require('../services/clientService');
const AppError = require('../util/errorHandler/appError');
const catchAsync = require('../util/errorHandler/catchAsync');
const { userServerError } = require('../util/errorHandler/userServerError');

//get all Clients
const clientGetAll = async (req, res) => {
    try {
        const params = req.query
        const { data, count } = await getAll(params)
        const response = {
            clients: data.map(client => ({
                id: client._id,
                firstname: client.firstname,
                lastname: client.lastname,
                phonenumber: client.phonenumber,
                email: client.email
            }
            )),
            totalPages: count,
            currentPage: params?.page
        }

        res.send(response)
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message || "Error Occurred while retriving user information" })
    }
}

//get the selected Client based on Params id 
const clientGetSingleClient = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await getSingle(id)
    if (!result) {
        throw new AppError('Record not found!', 404);
    } else {
        res.send(result)
    }
})

//Client create post API call (Save form data in db)
const clientCreatePost = async (req, res) => {

    const { firstname, lastname, phonenumber, email } = req.body

    try {
        const user = await getClientByEmail(email)

        if (user) {
            return res.status(203).json({
                status: false,
                message: 'This email is already in use.'
            });
        } else {
            const result = await createPost({ firstname, lastname, phonenumber, email })
            res.send(result)
        }

    } catch (error) {
        const errors = { firstname: '', lastname: '', username: '', phonenumber: '' };
        userServerError(error, errors, 'Client', res)

        // let err = userServerError(error, errors, 'Client')
        // res.status(400).send({ status: false, error: err || "Error creating the Client!" })
    }
}

//delete selected Client 
const clientDelete = async (req, res) => {

    try {
        const id = req.params.id;
        const result = await deleteClient(id)
        if (!result) {
            res.status(404).send({ message: `Cannot Delete user with ${id}. Maybe user not found!` })
        } else {
            res.send({ message: "User was deleted successfully!" })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: `Could not delete User with id= ${id}` })
    }
}

//update selected client
const clientUpdate = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await getClientByEmail(req.body.email)

        if (user && (id != user.id)) {
            return res.status(203).json({
                status: false,
                message: 'This email is already in use.'
            });
        } else {
            // const result = await Client.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
            const result = await updateClient(id, req.body)
            if (!result) {
                res.status(404).send({ message: `Cannot Update client with ${id}. Maybe client not found!` })
            } else {
                res.send(result)
            }
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error Updating client information" })
    }
}

module.exports = {
    clientGetAll,
    clientGetSingleClient,
    clientCreatePost,
    clientDelete,
    clientUpdate
}