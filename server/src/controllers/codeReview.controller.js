const { analyzeCode } = require("../services/codeReview.service");

const analyzeRepository = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        error: "repoUrl is required",
      });
    }

    const result = await analyzeCode(repoUrl);

    if (result?.error) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeRepository };