const { getAll,
    getSingle,
    deleteClient,
    createPost,
    updateClient,
    getClientByEmail
} = require('../services/clientService');
const AppError = require('../util/errorHandler/appError');
const catchAsync = require('../util/errorHandler/catchAsync');

//get all Clients
const clientGetAll = catchAsync(async (req, res, next) => {
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
        allClientCount: count,
        currentPage: params?.page
    }
    res.send(response)
})

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
const clientCreatePost = catchAsync(async (req, res, next) => {
    const { firstname, lastname, phonenumber, email } = req.body
    const user = await getClientByEmail(email)

    if (user) {
        throw new AppError('This email is already in use.', 203);
    } else {
        const result = await createPost({ firstname, lastname, phonenumber, email })
        res.send(result)
    }
})

//delete selected Client 
const clientDelete = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await deleteClient(id)
    if (!result) {
        throw new AppError('Cannot Delete client. Maybe client not found!', 404);
    } else {
        res.send({ message: "User was deleted successfully!" })
    }
})

//update selected client
const clientUpdate = catchAsync(async (req, res) => {
    const id = req.params.id;
    const user = await getClientByEmail(req.body.email)

    if (user && (id != user.id)) {
        throw new AppError('This email is already in use.', 203);
    } else {
        const result = await updateClient(id, req.body)
        if (!result) {
            throw new AppError('Cannot Update client. Maybe client not found!', 404);
        } else {
            res.send(result)
        }
    }
})

module.exports = {
    clientGetAll,
    clientGetSingleClient,
    clientCreatePost,
    clientDelete,
    clientUpdate
}