const { Types } = require('mongoose');

const objectIdValider = (moduleProp, label) => {
    if(!Types.ObjectId.isValid(moduleProp)) {
        throw new Error(`${label} object id not passed`)
    }
}

module.exports = {
    objectIdValider
}