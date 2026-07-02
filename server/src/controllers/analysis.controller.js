const Analysis =
  require("../models/Analysis");

const getAnalysisStats =
  async (req, res) => {

    try {

      const totalRepositories =
        await Analysis.countDocuments();

      const avgScore =
        await Analysis.aggregate([
          {
            $group: {
              _id: null,
              avgScore: {
                $avg: "$score"
              }
            }
          }
        ]);

      const analyses =
        await Analysis.find();

      let totalIssues = 0;

      analyses.forEach(
        analysis => {
          totalIssues +=
            analysis.issues.length;
        }
      );

      res.json({

        totalRepositories,

        averageScore:
          Math.round(
            avgScore[0]?.avgScore || 0
          ),

        totalIssues

      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message
      });

    }

  };

module.exports = {
  getAnalysisStats
};