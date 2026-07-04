const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  repoName: String,
  repoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Repository', repositorySchema);