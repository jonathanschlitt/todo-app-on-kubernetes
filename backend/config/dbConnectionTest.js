const cassandra = require('cassandra-driver');
const {
  DATABASE_CONTACT_POINTS,
  DATABASE_LOCAL_DATACENTER,
  DATABASE_KEYSPACE,
  DATABASE_USER,
  DATABASE_PASS,
} = process.env;

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  DATABASE_USER,
  DATABASE_PASS
);

const cassandraClient = new cassandra.Client({
  contactPoints: DATABASE_CONTACT_POINTS.split(','),
  localDataCenter: DATABASE_LOCAL_DATACENTER,
  keyspace: DATABASE_KEYSPACE,
  authProvider: authProvider,
});

const checkUptime = async () => {
  try {
    await cassandraClient.connect();

    const data = await cassandraClient.execute(
      'SELECT now() FROM system.local'
    );

    // console.log('Scylla cluster is up!');
    if (data)
      return {
        status: 'success',
      };
    else return { status: 'error' };
  } catch (error) {
    // console.error(`Error checking Scylla cluster uptime: ${error}`);

    return {
      status: 'error',
    };
  }
};

module.exports = { checkUptime };
