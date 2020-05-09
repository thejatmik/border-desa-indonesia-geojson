const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const fileStream = fs.createReadStream(path.join(__dirname, './geojson/indonesia_villages_border.geojson'));
const jsonStream = StreamArray.withParser();

const processingStream = new Writable({
  write({key, value}, encoding, callback) {
    setTimeout(() => { // async process
      
      assert(typeof value == 'object' && !Array.isArray(value), "not an object");
      assert(typeof value.province == 'string', 'province must be a string');
      assert(typeof value.district == 'string', 'district must be a string');
      assert(typeof value.sub_district == 'string', 'sub_district must be a string');
      assert(typeof value.village == 'string', 'village must be a string');
      assert(typeof value.border == 'object' && Array.isArray(value.border), 'border must be an array');

      console.log(value) // parsed value per index
      callback() // called after finished processing
    }, 10)
  },
  objectMode: true
})

fileStream.pipe(jsonStream.input);
jsonStream.pipe(processingStream);

processingStream.on('finish', () => console.log('All done'));