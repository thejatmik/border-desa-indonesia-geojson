const assert = require('assert');
const dissolve = require('@turf/dissolve');
const turf = require('@turf/turf');

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
    subdistrict: (parent, args, context, info) => {
      let { province, district, keyword } = args
      keyword = keyword.toUpperCase()
      return new Promise((resolve, reject) => {
        Village.distinct('village', { sub_district: keyword })
          .then(res => {
            console.log(res)
            resolve(res)
          })
      })
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
    },
    provinceList: () => {
      return new Promise((resolve, reject) => {
        Village.distinct('province')
          .then(provinces => {
            resolve({ provinces })
          })
      })
    },
    districtList: (parent, args, context, info) => {
      let { province } = args
      province = province.toUpperCase()
      return new Promise((resolve, reject) => {
        Village.distinct('district', { province })
          .then(res => {
            resolve({
              province,
              districts: res
            })
          })
      })
    },
    subdistrictList: (parent, args, context, info) => {
      let { province, district } = args
      province = province.toUpperCase()
      district = district.toUpperCase()
      return new Promise((resolve, reject) => {
        Village.distinct('sub_district', { province, district })
          .then(res => {
            resolve({
              province,
              district,
              subdistricts: res
            })
          })
      })
    },
    villageList: (parent, args, context, info) => {
      let { province, district, sub_district } = args
      province = province.toUpperCase()
      district = district.toUpperCase()
      sub_district = sub_district.toUpperCase()
      return new Promise((resolve, reject) => {
        Village.distinct('village', { province, district, sub_district })
          .then(res => {
            resolve({
              province,
              district,
              sub_district,
              villages: res
            })
          })
      })
    },
    villageBorder: (parent, args, context, info) => {
      let { province, district, sub_district, village } = args
      province = province.toUpperCase()
      district = district.toUpperCase()
      sub_district = sub_district.toUpperCase()
      village = village.toUpperCase()
      return new Promise((resolve, reject) => {
        Village.findOne({ province, district, sub_district, village })
          .then(res => {
            resolve(res)
          })
      })
    },
    subdistrictBorder: (parent, args, context, info) => {
      let { province, district, sub_district } = args
      province = province.toUpperCase()
      district = district.toUpperCase()
      sub_district = sub_district.toUpperCase()

      return new Promise((resolve, reject) => {
        Village.distinct('village', { province, district, sub_district })
          .then(villageList => {  
            let findVillages = []
            villageList.forEach(village => {
              findVillages.push(Village.findOne({ province, district, sub_district, village }))
            })
            return Promise.all(findVillages)
          })
          .then(results => {
            let compiledBorder = results.map(village => {
              return turf.polygon(village.border.coordinates, {combine: "yes"})
            })
            
            let features = turf.featureCollection(compiledBorder)
            
            let dissolved = turf.dissolve(features, { propertyName: 'combine' });
            
            resolve({
              province,
              district,
              sub_district,
              border: dissolved.features[0].geometry
            })
          })
      })
    }
  }
};

module.exports = resolvers;