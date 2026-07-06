const Analysis = require("../models/Analysis");

const getHistory = async (req, res) => {
  const history = await Analysis.find()
    .sort({ createdAt: -1 })
    .limit(30);

  res.json(history);
};

module.exports = { getHistory };