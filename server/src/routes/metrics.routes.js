const express = require('express');
const router = express.Router();

const {
  getDashboardMetrics,
  getTimelineMetrics
} = require('../controllers/metrics.controller');

router.get('/summary', getDashboardMetrics);
router.get('/timeline', getTimelineMetrics);

module.exports = router;