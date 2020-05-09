const assert = require('assert');
const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const path = require('path');
const fs = require('fs');

const fileStream = fs.createReadStream(path.join(__dirname, './geojson/indonesia_villages_border.geojson'));
const jsonStream = StreamArray.withParser();

const mongoVillage = require('./db/village_mongodb');

const collection = 'Village';
const meta = 'Meta'; // {lastUpdated: Date()}

mongoVillage.connectToServer()
  .then(() => {
    const client = mongoVillage.getClient();
    const db = mongoVillage.getDB();
    console.log('Server connected');
    db
      .collection(meta)
      .findOneAndUpdate(
        {},
        {
          $set: { lastUpdated: Date() }
        },
        {
          upsert: true,
          returnOriginal: false
        }
      )
      .then(res => {
        console.log(res.value)
        client.close()
      })
  })
  .catch(err => {
    console.log(err.message);
  })

// start seeder
mongoVillage.connectToServer()
  .then(() => {
    const client = mongoVillage.getClient();
    const db = mongoVillage.getDB();
    console.log("Server initiated");
    console.log("Start reading json file");

    const processingStream = new Writable({
      write({key, value}, encoding, callback) {
          
        assert(typeof value == 'object' && !Array.isArray(value), "not an object");
        assert(typeof value.province == 'string', 'province must be a string');
        assert(typeof value.district == 'string', 'district must be a string');
        assert(typeof value.sub_district == 'string', 'sub_district must be a string');
        assert(typeof value.village == 'string', 'village must be a string');
        assert(typeof value.border == 'object' && Array.isArray(value.border), 'border must be an array');
        console.log(`${value.province}, ${value.district}, ${value.sub_district}, ${value.village}`)
        
        db
          .collection(collection)
          .findOneAndUpdate(
            {
              province: value.province,
              district: value.district,
              sub_district: value.sub_district,
              village: value.village
            },
            {
              $set: {
                province: value.province,
                district: value.district,
                sub_district: value.sub_district,
                village: value.village,
                border: {
                  type: "Polygon",
                  coordinates: [ value.border ],
                }
              }
            },
            {
              upsert: true
            }
          )
          .then(_ => {
            // console.log(value) // parsed value per index
            console.log(`${value.province}, ${value.district}, ${value.sub_district}, ${value.village}`)
            callback() // called after finished processing
          })
          .catch(err => {
            console.log(err.message);
          })
      },
      objectMode: true
    })

    fileStream.pipe(jsonStream.input);
    jsonStream.pipe(processingStream);

    processingStream.on('finish', () => {
      console.log('All done')
      client.close();
    });
  })