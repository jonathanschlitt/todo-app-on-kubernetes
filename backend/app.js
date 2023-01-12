const express = require('express');

require('express-async-errors');

const cors = require('cors');
const env = require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const passport = require('passport');

const app = express();

// middleware

app.use(cors());

app.use(express.json());

app.use(passport.initialize());

// Bring in the Strategy
require('./config/passport')(passport);

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const {cassandraClient, cassandraAdminClient, initDatabase} = require("./config/db");

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Todo-App-API</h1>');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5678;

app.listen(PORT, () => {
  console.log("Server starting...")
  initDatabase();
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
