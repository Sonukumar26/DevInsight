const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const {
  getAnalysisStats
} = require(
  "../controllers/analysis.controller"
);

router.get("/history", async (req, res) => {

  try {

    const analyses = await Analysis
      .find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(analyses);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.delete("/history/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Analysis.findByIdAndDelete(id);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/stats",
  getAnalysisStats
);
router.get(
  "/test-analysis",
  async (req, res) => {

    try {

      const doc =
        await Analysis.create({

          repository:
            "test",

          filesAnalyzed:
            ["a.js"],

          score: 100,

          issues: [
            {
              file: "a.js",
              type: "Style",
              message: "test"
            }
          ],

          aiReviews: [
            "hello"
          ]

        });

      res.json(doc);

    } catch (err) {

      res.status(500).json({
        error:
          err.message
      });

    }

  }
);
module.exports = router;