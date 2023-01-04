const cassandra = require('cassandra-driver');
const env = require('dotenv').config();
//let authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.DATABASE_USER, process.env.DATABASE_PASS);
let authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.DATABASE_USER, process.env.DATABASE_PASS);

const cassandraClient = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'us-east-1',
  keyspace: 'todoapp',
   authProvider: authProvider
});
module.exports = { cassandraClient}
