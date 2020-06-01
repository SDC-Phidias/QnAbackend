const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: 127.0.0.1,
  localDataCenter: process.env.DB_DATA_CENTER || 'datacenter1',
});

client.connect();

module.exports = client;