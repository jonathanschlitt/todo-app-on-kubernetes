const express = require('express');
const client = require('prom-client');
const { checkUptime } = require('./config/dbConnectionTest');

const app = express();

const labels = ['method', 'route', 'status', 'host', 'user_agent', 'ip'];

// Define the metrics we want to collect

const requestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: labels,
  buckets: [0.1, 5, 15, 50, 100, 500],
  // registers: [registry],
});

const dbRequestDurationHistogram = new client.Histogram({
  name: 'db_request_duration_seconds',
  help: 'Duration of DB requests in seconds',
  labelNames: ['status'],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

const dbRequestSeconds = async () => {
  const startTime = process.hrtime();

  const success = await checkUptime();

  // Code to connect to the database
  const durationInSeconds =
    process.hrtime(startTime)[0] + process.hrtime(startTime)[1] / 1e9;

  // Record the duration of the request in the histogram
  dbRequestDurationHistogram.observe(success, durationInSeconds);
};

setInterval(dbRequestSeconds, 60000);

const requestsTotalCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests made.',
  labelNames: labels,
  // registers: [registry],
});

const requestsFailedCounter = new client.Counter({
  name: 'http_requests_failed_total',
  help: 'Total number of failed HTTP requests made.',
  labelNames: labels,
  // registers: [registry],
});

const requestsSuccessCounter = new client.Counter({
  name: 'http_requests_success_total',
  help: 'Total number of successful HTTP requests made.',
  labelNames: labels,
  // registers: [registry],
});

const requestIpsSummary = new client.Summary({
  name: 'http_request_ips',
  help: 'Summary of different request ips',
  labelNames: labels,
  // registers: [registry],
});

const requestsPerMinuteGauge = new client.Gauge({
  name: 'http_requests_per_minute',
  help: 'Number of requests per minute',
  labelNames: labels,
  // registers: [registry],
});

const requestsFromMacOs = new client.Counter({
  name: 'http_requests_from_macos',
  help: 'Number of requests from MacOS',
  labelNames: labels,
  // registers: [registry],
});

const requestsFromWindows = new client.Counter({
  name: 'http_requests_from_windows',
  help: 'Number of requests from Windows',
  labelNames: labels,
  // registers: [registry],
});

// Define the Express middleware function to collect metrics
function metricsMiddleware(req, res, next) {
  const requestIp =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const userAgent = req.headers['user-agent'];

  const requestHostname = req.hostname;

  const requestMethod = req.method;

  const requestUrl = req.url;

  const requestStatus = res.statusCode;

  // number of requests per minute
  requestsPerMinuteGauge.inc();

  console.log(
    requestMethod,
    requestUrl,
    requestStatus,
    requestHostname,
    userAgent,
    requestIp
  );

  // number of requests from MacOS
  if (userAgent.includes('Macintosh')) {
    requestsFromMacOs.labels(
      requestMethod,
      requestUrl,
      requestStatus,
      requestHostname,
      userAgent,
      requestIp
    );
  }

  // number of requests from Windows
  if (userAgent.includes('Windows')) {
    requestsFromWindows.labels(
      requestMethod,
      requestUrl,
      requestStatus,
      requestHostname,
      userAgent,
      requestIp
    );
  }

  // Start a timer to measure the duration of the request
  const startTime = process.hrtime();

  // Set up an event listener to log the duration of the request when it finishes
  res.on('finish', () => {
    // Calculate the duration of the request in seconds
    const durationInSeconds =
      process.hrtime(startTime)[0] + process.hrtime(startTime)[1] / 1e9;

    // Increment the appropriate metrics based on the status of the response
    if (res.statusCode >= 400 && res.statusCode < 500) {
      requestsFailedCounter
        .labels(
          requestMethod,
          requestUrl,
          requestStatus,
          requestHostname,
          userAgent,
          requestIp
        )
        .inc();
    } else if (res.statusCode >= 200 && res.statusCode < 300) {
      requestsSuccessCounter
        .labels(
          requestMethod,
          requestUrl,
          requestStatus,
          requestHostname,
          userAgent,
          requestIp
        )
        .inc();
    }

    // Record the duration of the request in the histogram
    requestDurationHistogram
      .labels(
        requestMethod,
        requestUrl,
        requestStatus,
        requestHostname,
        userAgent,
        requestIp
      )
      .observe(durationInSeconds);

    // Record the IP address of the requester in the summary
    requestIpsSummary
      .labels(
        requestMethod,
        requestUrl,
        requestStatus,
        requestHostname,
        userAgent,
        requestIp
      )
      .observe(1);

    // Increment the total number of requests
    requestsTotalCounter
      .labels(
        requestMethod,
        requestUrl,
        requestStatus,
        requestHostname,
        userAgent,
        requestIp
      )
      .inc();
  });

  // Pass control to the next middleware function
  next();
}

const startMetricsServer = () => {
  app.listen(9100, () => {
    console.log('Metrics server listening on port 9100');

    const collectDefaultMetrics = client.collectDefaultMetrics;

    collectDefaultMetrics();

    // Expose the metrics over HTTP
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    });
  });
};

module.exports = {
  startMetricsServer,
  metricsMiddleware,
};
