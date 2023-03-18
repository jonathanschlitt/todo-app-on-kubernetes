const express = require('express');

require('express-async-errors');

const cors = require('cors');
const env = require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const passport = require('passport');

const app = express();

const { startMetricsServer, metricsMiddleware } = require('./metrics');

// Add the middleware function to the Express app

// middleware

app.use(metricsMiddleware);

app.use(cors());

app.use(express.json());

app.use(passport.initialize());

// Bring in the Strategy
require('./config/passport')(passport);

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { initDatabase } = require('./config/db');

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Todo-App-API</h1>');
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

const workerHostname = process.env.NODE_WORKER_HOSTNAME;
console.log(`Worker hostname: ${workerHostname}`);

const PORT = process.env.PORT || 5678;

app.listen(PORT, async () => {
  console.log('Server starting...');
  try {
    await initDatabase();
  } catch (error) {
    console.log('app.listen' + error);
  }

  console.log(`Server running on port ${PORT}`);

  startMetricsServer();
});

app.use(notFound);
app.use(errorHandler);

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
