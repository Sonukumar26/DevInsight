const mongoose = require("mongoose");


const apiMetricSchema = new mongoose.Schema({

  endpoint: String,
  method: String,
  statusCode: Number,
  responseTime: Number,

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "ApiMetric",
  apiMetricSchema
);
