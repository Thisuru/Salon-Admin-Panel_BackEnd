const jwt = require('jsonwebtoken');

//create JWT Token Service
const createToken = (email) => {
    const maxAge = '24h';
    const accessToken = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: maxAge });
    return accessToken;

}

module.exports = {
    createToken
}