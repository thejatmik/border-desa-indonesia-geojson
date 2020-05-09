// https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'village';

let _db;
let _client;

module.exports = {
  connectToServer: function () {
    return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(client => {
        _client = client;
        _db = client.db(dbName);
      })
  },

  getDB: () => {
    return _db;
  },

  getClient: () => {
    return _client;
  }
}