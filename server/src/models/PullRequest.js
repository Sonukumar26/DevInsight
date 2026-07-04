const mongoose = require('mongoose');

const pullRequestSchema = new mongoose.Schema({
  repoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository'
  },
  prNumber: Number,
  title: String,
  author: String,
  complexityScore: Number,
  lintIssues: Number,
  qualityScore: Number,
  suggestions: [String],
  analyzedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PullRequest', pullRequestSchema);