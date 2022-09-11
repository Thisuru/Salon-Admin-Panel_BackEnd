const Stylist = require("../models/stylist");

//get all Clients service
const getAvailableFromResevedIds = (resevedIds) => {
  return Stylist.find({
    _id: {
      $nin: resevedIds,
    },
  });
};

module.exports = {
  getAvailableFromResevedIds,
};
