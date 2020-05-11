const assert = require('assert');

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
    villages: (parent, args, context, info) => {
      let { limit, skip, options } = args;
      Object.keys(options).forEach(key => {
        if (['province', 'district', 'sub_district'].includes(key)) {
          options[key] = options[key].toUpperCase()
        }
      })
      return new Promise((resolve, reject) => {
        Village.find(options)
          .limit(limit)
          .skip(skip || 0)
          .toArray((err, res) => {
            if (err) reject(err)
            else resolve(res)
          })
      })
    },
    search: (parent, args, context, info) => {
      let { keyword, limit } = args;
      keyword = keyword.toUpperCase();
      return new Promise((resolve, reject) => {
        Village.find({
          $or: [
            { province: keyword },
            { district: keyword },
            { sub_district: keyword },
            { village: keyword }
          ]
        })
          .limit(limit || 5)
          .skip(0)
          .toArray((err, res) => {
            if (err) reject(err)
            else resolve(res)
          })
      })
    }
  }
};

module.exports = resolvers;