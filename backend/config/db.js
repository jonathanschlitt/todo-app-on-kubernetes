const cassandra = require('cassandra-driver');
const env = require('dotenv').config();
//let authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.DATABASE_USER, process.env.DATABASE_PASS);
let authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.DATABASE_USER, process.env.DATABASE_PASS);
let CREATE_KEYSPACE_QUERY = "create keyspace todoapp with replication = {'class': 'SimpleStrategy', 'replication_factor': 3};"

let CREATE_TODO_TABLE_QUERY = "create table if not exists todo\n" +
    "(\n" +
    "    id          uuid primary key,\n" +
    "    active      boolean,\n" +
    "    deadline    text,\n" +
    "    description text,\n" +
    "    name        text,\n" +
    "    showdetails boolean,\n" +
    "    user_id     uuid\n" +
    ")\n" +
    "with caching = {'keys': 'ALL', 'rows_per_partition': 'ALL'}\n" +
    "    and compaction = {'class': 'SizeTieredCompactionStrategy'}\n" +
    "and compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}\n" +
    "and dclocal_read_repair_chance = 0\n" +
    "and speculative_retry = '99.0PERCENTILE';"

let CREATE_USER_TABLE_QUERY = "create table if not exists user\n" +
    "(\n" +
    "    id       uuid primary key,\n" +
    "    email    text,\n" +
    "    lastname text,\n" +
    "    password text,\n" +
    "    surname  text\n" +
    ")\n" +
    "with caching = {'keys': 'ALL', 'rows_per_partition': 'ALL'}\n" +
    "    and compaction = {'class': 'SizeTieredCompactionStrategy'}\n" +
    "and compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}\n" +
    "and dclocal_read_repair_chance = 0\n" +
    "and speculative_retry = '99.0PERCENTILE';"


const cassandraAdminClient = new cassandra.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'us-east-1',
    authProvider: authProvider
});

const cassandraClient = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'us-east-1',
  keyspace: 'todoapp',
   authProvider: authProvider
});

function initDatabase(){
    cassandraClient.connect(function(e) {
        if (e !== null) {
            if (e.toString().includes("Keyspace 'todoapp' does not exist")) {
                console.log("Server is creating needed Keyspace")
                cassandraAdminClient.connect(function (e) {
                    cassandraAdminClient.execute(CREATE_KEYSPACE_QUERY, function(e, res) {
                        console.log("Server created required Keyspace")
                        cassandraClient.execute(CREATE_USER_TABLE_QUERY, function(e, res) {
                            console.log("Server created Table User")
                        });

                        cassandraClient.execute(CREATE_TODO_TABLE_QUERY, function(e, res) {
                            console.log("Server created Table Todo")
                        });
                    });
                })
            }
        } else {
            cassandraClient.execute(CREATE_USER_TABLE_QUERY, function(e, res) {});
            cassandraClient.execute(CREATE_TODO_TABLE_QUERY, function(e, res) {});
        }
    });
}

module.exports = { cassandraClient, cassandraAdminClient, initDatabase}
