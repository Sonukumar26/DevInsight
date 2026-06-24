
const { getMetricsSummary } = require(
  "../services/metrics.service"
);

const ApiMetric = require(
  "../models/ApiMetric"
);

/* -----------------------------
   DASHBOARD SUMMARY
------------------------------ */
const getDashboardMetrics = async (
  req,
  res
) => {

  try {

    const summary =
      await getMetricsSummary();

    return res.json(summary);

  } catch (error) {

    console.log(
      "Dashboard Error:",
      error.message
    );

    return res.status(500).json({
      error: error.message
    });

  }

};

/* -----------------------------
   TIME RANGE HELPER
------------------------------ */
const getTimeFilter = range => {

  const now = new Date();

  switch (range) {

    case "1h":
      return new Date(
        now.getTime() -
        60 * 60 * 1000
      );

    case "24h":
      return new Date(
        now.getTime() -
        24 * 60 * 60 * 1000
      );

    case "7d":
  return new Date(
    now.getTime() -
    7 * 24 * 60 * 60 * 1000
  );

    default:
      return new Date(
        now.getTime() -
        24 * 60 * 60 * 1000
      );

  }

};



/* -----------------------------
   TIMELINE ANALYTICS
------------------------------ */
const getTimelineMetrics = async (req, res) => {

  try {

    const range =
      req.query.range || "24h";

    const timeFilter =
      getTimeFilter(range);

      console.log("Range:", range);
      console.log("Time Filter:", timeFilter);

      const count = await ApiMetric.countDocuments({
        timestamp: {
          $gte: timeFilter
        }
      });

      console.log("Matching Records:", count);

    const data = await ApiMetric.aggregate([
                {
                  $match: {
                    timestamp: {
                      $gte: timeFilter
                    }
                  }
                },

                {
                  $group: {

                    _id: {
                      $dateToString: {
                        format:
                          range === "7d"
                            ? "%Y-%m-%d"
                            : "%H:%M",
                        date: "$timestamp"
                      }
                    },

                    apiCalls: {
                      $sum: 1
                    },

                    avgResponse: {
                      $avg: "$responseTime"
                    },

                    errors: {
                      $sum: {
                        $cond: [
                          {
                            $gte: [
                              "$statusCode",
                              400
                            ]
                          },
                          1,
                          0
                        ]
                      }
                    }

                  }

                },

                {
                  $sort: {
                    _id: 1
                  }
                }

              ]);

       const formatted =
          data.map(item => ({

            time: item._id,

            apiCalls:
              item.apiCalls || 0,

            avgResponse:
              Math.round(
                item.avgResponse || 0
              ),

            errors:
              item.errors || 0

          }));
    return res.json(
      formatted
    );

  } catch (error) {

    console.log(
      error.message
    );

    return res
      .status(500)
      .json({
        error:
          error.message
      });

  }

};

module.exports = {
  getDashboardMetrics,
  getTimelineMetrics
};
