const Stylist = require("../models/stylist");

//get all Clients service
const getAvailableFromResevedIds = (resevedIds) => {
  return Stylist.find({
    _id: {
      $nin: resevedIds,
    },
  });
};

//get single Stylist Service
const getSingle = (id) => {
  return Stylist.findById(id)
}

module.exports = {
  getAvailableFromResevedIds,
  getSingle
};
