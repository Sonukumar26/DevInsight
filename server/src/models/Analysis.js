const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    file: String,
    type: String,
    message: String
  },
  { _id: false }
);

const analysisSchema =
  new mongoose.Schema({

    repository: String,

    filesAnalyzed: [String],

    score: Number,

    issues: [issueSchema],

    aiReviews: [String],

    createdAt: {
      type: Date,
      default: Date.now
    }

  });

module.exports =
  mongoose.model(
    "Analysis",
    analysisSchema
  );