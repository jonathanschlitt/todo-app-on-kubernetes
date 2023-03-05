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

const CREATE_KEYSPACE_QUERY = `CREATE KEYSPACE IF NOT EXISTS ${DATABASE_KEYSPACE} WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3};`;

const CREATE_TODO_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS todo (
    id          UUID PRIMARY KEY,
    active      BOOLEAN,
    deadline    TEXT,
    description TEXT,
    name        TEXT,
    showdetails BOOLEAN,
    user_id     UUID
) WITH caching = {'keys': 'ALL', 'rows_per_partition': 'ALL'}
  AND compaction = {'class': 'SizeTieredCompactionStrategy'}
  AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
  AND dclocal_read_repair_chance = 0
  AND speculative_retry = '99.0PERCENTILE';`;

const CREATE_USER_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS user (
    id       UUID PRIMARY KEY,
    email    TEXT,
    lastname TEXT,
    password TEXT,
    surname  TEXT
) WITH caching = {'keys': 'ALL', 'rows_per_partition': 'ALL'}
  AND compaction = {'class': 'SizeTieredCompactionStrategy'}
  AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
  AND dclocal_read_repair_chance = 0
  AND speculative_retry = '99.0PERCENTILE';`;

const cassandraAdminClient = new cassandra.Client({
        contactPoints: DATABASE_CONTACT_POINTS.split(','),
        localDataCenter: DATABASE_LOCAL_DATACENTER,
        authProvider: authProvider,
    }
);

const cassandraClient = new cassandra.Client({
    contactPoints: DATABASE_CONTACT_POINTS.split(','),
    localDataCenter: DATABASE_LOCAL_DATACENTER,
    keyspace: DATABASE_KEYSPACE,
    authProvider: authProvider,
});

const initDatabase = async () => {
    try {
        await cassandraClient.connect();
        console.log(`Connected to Cassandra cluster at ${DATABASE_CONTACT_POINTS}`);

        // Check if keyspace exists, create it if not
        const keyspaceMetadata = await cassandraClient.execute(
            `SELECT * FROM system_schema.keyspaces WHERE keyspace_name = '${DATABASE_KEYSPACE}'`,
            null, {consistency: cassandra.types.consistencies.localQuorum}
        );
        if (keyspaceMetadata.rows.length === 0) {
            console.log(`Creating keyspace ${DATABASE_KEYSPACE}`);
            await cassandraAdminClient.connect();
            await cassandraAdminClient.execute(CREATE_KEYSPACE_QUERY, null, {consistency: cassandra.types.consistencies.localQuorum});
            console.log(`Created keyspace ${DATABASE_KEYSPACE}`);
        }

        // Create user table
        console.log(`Creating table user in keyspace ${DATABASE_KEYSPACE}`);
        await cassandraClient.execute(CREATE_USER_TABLE_QUERY, null, {consistency: cassandra.types.consistencies.localQuorum});
        console.log(`Created table user in keyspace ${DATABASE_KEYSPACE}`);

        // Create todo table
        console.log(`Creating table todo in keyspace ${DATABASE_KEYSPACE}`);
        await cassandraClient.execute(CREATE_TODO_TABLE_QUERY, null, {consistency: cassandra.types.consistencies.localQuorum});
        console.log(`Created table todo in keyspace ${DATABASE_KEYSPACE}`);
    } catch (error) {
        console.error(`Error initializing Cassandra database: ${error}`);
    }
};

module.exports = {cassandraClient, cassandraAdminClient, initDatabase};
