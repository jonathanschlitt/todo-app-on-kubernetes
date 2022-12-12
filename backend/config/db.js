const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'todoapp',
});

export default cassandraClient;
