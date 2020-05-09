const fs = require('fs');
const {parser} = require('stream-json/Parser');

const pipeline = fs.createReadStream('./geojson/indonesia_villages_border.geojson').pipe(parser());

let objCounter = 0;
// pipeline.on('data', data => data.province === 'startObject' && objCounter++);
pipeline.on('data', data => {
  console.log(data);
});
pipeline.on('end', () => console.log(`Found ${objCounter} objects.`));

//const file = JSON.parse(fs.readFileSync('./geojson/indonesia_villages_border.geojson', 'utf8'));
//console.log(file[0]);
