const express = require("express");
const router = express.Router();

const { analyzeRepository } = require("../controllers/codeReview.controller");
const { getHistory } = require("../controllers/historyController");

// ✅ Use controller (correct way)
router.post("/review", analyzeRepository);

// history route
router.get("/history", getHistory);

module.exports = router;