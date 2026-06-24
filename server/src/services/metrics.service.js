const ApiMetric = require("../models/ApiMetric");

const getMetricsSummary = async () => {

  const totalRequests =
    await ApiMetric.countDocuments();

  const avgResponse =
    await ApiMetric.aggregate([
      {
        $group: {
          _id: null,
          avg: {
            $avg: "$responseTime"
          }
        }
      }
    ]);

  const averageTime =
    avgResponse[0]?.avg || 0;

  const errorCount =
    await ApiMetric.countDocuments({
      statusCode: {
        $gte: 400
      }
    });

  const successCount =
    await ApiMetric.countDocuments({
      statusCode: {
        $lt: 400
      }
    });

  const clientErrors =
    await ApiMetric.countDocuments({
      statusCode: {
        $gte: 400,
        $lt: 500
      }
    });

  const serverErrors =
    await ApiMetric.countDocuments({
      statusCode: {
        $gte: 500
      }
    });

  const slowEndpoints =
    await ApiMetric.aggregate([
      {
        $group: {
          _id: "$endpoint",

          avgTime: {
            $avg: "$responseTime"
          },

          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          avgTime: -1
        }
      },
      {
        $limit: 5
      }
    ]);

  const suggestions = [];

  if (averageTime > 1000) {
    suggestions.push(
      "High response time detected. Consider caching and database indexing."
    );
  }

  if (errorCount > 50) {
    suggestions.push(
      "High error volume detected. Review API logs."
    );
  }

  return {

    totalRequests,

    successCount,

    clientErrors,

    serverErrors,

    avgResponseTime:
      Number(averageTime).toFixed(2),

    errorRate:
      totalRequests > 0
        ? (
            (errorCount / totalRequests) *
            100
          ).toFixed(2)
        : "0.00",

    slowEndpoints:
      slowEndpoints.map(endpoint => ({
        endpoint: endpoint._id,
        avgTime: Math.round(endpoint.avgTime),
        count: endpoint.count
      })),

    suggestions

  };

};

module.exports = {
  getMetricsSummary
};