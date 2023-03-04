const express = require('express');

require('express-async-errors');

const cors = require('cors');
const env = require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const passport = require('passport');

const app = express();

const client = require('prom-client');
const register = new client.Registry();

// Define a custom registry to hold our metrics
const registry = new client.Registry();

// Define the metrics we want to collect
const requestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 5, 15, 50, 100, 500],
  registers: [registry],
});

const requestsTotalCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests made.',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

const requestsFailedCounter = new client.Counter({
  name: 'http_requests_failed_total',
  help: 'Total number of failed HTTP requests made.',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

const requestsSuccessCounter = new client.Counter({
  name: 'http_requests_success_total',
  help: 'Total number of successful HTTP requests made.',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

const requestIpsSummary = new client.Summary({
  name: 'http_request_ips',
  help: 'Summary of different request ips',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

const requestsPerMinuteGauge = new client.Gauge({
  name: 'http_requests_per_minute',
  help: 'Number of requests per minute',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

const requestsFromMacOs = new client.Counter({
  name: 'http_requests_from_macos',
  help: 'Number of requests from MacOS',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

const requestsFromWindows = new client.Counter({
  name: 'http_requests_from_windows',
  help: 'Number of requests from Windows',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

// Define the Express middleware function to collect metrics
function metricsMiddleware(req, res, next) {
  // number of requests per minute
  requestsPerMinuteGauge.inc();

  // number of requests from MacOS
  if (req.headers['user-agent'].includes('Macintosh')) {
    requestsFromMacOs.labels(req.method, req.url, res.statusCode);
  }

  // number of requests from Windows
  if (req.headers['user-agent'].includes('Windows')) {
    requestsFromWindows.labels(req.method, req.url, res.statusCode);
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
      requestsFailedCounter.labels(req.method, req.url, res.statusCode).inc();
    } else if (res.statusCode >= 200 && res.statusCode < 300) {
      requestsSuccessCounter.labels(req.method, req.url, res.statusCode).inc();
    }

    // Record the duration of the request in the histogram
    requestDurationHistogram
      .labels(req.method, req.url, res.statusCode)
      .observe(durationInSeconds);

    // Record the IP address of the requester in the summary
    requestIpsSummary.labels(req.method, req.url, res.statusCode).observe(1);

    // Increment the total number of requests
    requestsTotalCounter.labels(req.method, req.url, res.statusCode).inc();
  });

  // Pass control to the next middleware function
  next();
}

// Add the middleware function to the Express app
app.use(metricsMiddleware);

client.collectDefaultMetrics({ register });

// middleware

app.use(cors());

app.use(express.json());

app.use(passport.initialize());

// Bring in the Strategy
require('./config/passport')(passport);

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const {
  cassandraClient,
  cassandraAdminClient,
  initDatabase,
} = require('./config/db');

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Todo-App-API</h1>');
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

// Expose the metrics over HTTP
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5678;

app.listen(PORT, () => {
  console.log('Server starting...');
  try{
    initDatabase();
  } catch (error) {
    console.log(error);
  }

  console.log(`Server running on port ${PORT}`);
});

// const bcrypt = require('bcrypt');

// const generateHash = async () => {

//   const salt = await bcrypt.genSalt();

//   console.log(await bcrypt.hash('Test1234', salt));
// };

// generateHash();

// console.log(
//   bcrypt.compareSync(
//     'Test12345',
//     '$2b$10$0lsHmHx7lUOJ6XZqG.WVqupwGWV60WxZT30xrKepYZy3497UZVefi'
//   )
// );
