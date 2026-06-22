const ApiMetric =
  require("../models/ApiMetric");

const apiMonitor =
  (req, res, next) => {

    console.log(
      "MONITOR:",
      req.method,
      req.originalUrl
    );

    const start = Date.now();

    res.on("finish", async () => {

      try {

        await ApiMetric.create({
          endpoint: req.originalUrl,
          method: req.method,
          responseTime:
            Date.now() - start,
          statusCode:
            res.statusCode,
          timestamp: new Date()
        });

        console.log(
          "METRIC SAVED:",
          req.originalUrl
        );

      } catch (error) {

        console.log(
          "Metric Save Error:",
          error.message
        );

      }

    });

    next();

  };

module.exports = apiMonitor;