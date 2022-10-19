const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 400;
    res.status(statusCode).json({
        success: 0,
        message: err.message,
        stack: err.stack
    })
}

module.exports = (err, req, res, next) => {
    sendErrorDev(err, res)
}