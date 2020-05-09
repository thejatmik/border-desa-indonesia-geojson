const db = require('../db/village_mongodb').getDB();
const Village = db.collection('Village');

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    village: () => {
      console.log('Village!')
      return Village
        .findOne({})
        .then(res => {
          return res
        });
    },
  }
};

module.exports = resolvers;