# Peta border wilayah Indonesia per desa dalam format geojson (total 83322 desa)

## Seed Database MongoDB untuk Ubuntu dengan Express + MongoDB Driver
### Requirement
    Ubuntu 18.04 (tested on)  
    MongoDB Server  
    NodeJS (npm)  

### Instalasi
Extract file *.zip
- `chmod u+x extract_map.sh && ./extract_map.sh`  
- `npm install`
- `node mongodbSeed.js`

## Mongo Shell
- `use village`
- Village count: 
    - `db.Village.find().count()`
- Polygon search :  
```
db.Village.find({
  border: {
    $geoWithin: {
      $geometry: {
          type: "Polygon",
          coordinates: [[ [97, 2], [98,2], [98,3], [97,3], [97,2] ]]
      }
    }
  }
})
```

## Cara parsing sebagai Pandas DataFrame:
1. Unzip `indonesia_villages_border.geojson.zip`
2. Pada Jupyter Notebook, ikuti code berikut

```python
#import libraries
import pandas as pd
import ast

#load data
with open('file-path/indonesia_villages_border.geojson') as myfile:
    data = ast.literal_eval(myfile.read())

#nitiate list containers
provinces = []
districts = []
sub_districts = []
villages = []
borders = []

#fill the lists via looping
for datapoint in data:
    provinces.append(datapoint.get('province'))
    districts.append(datapoint.get('district'))
    sub_districts.append(datapoint.get('sub_district'))
    villages.append(datapoint.get('village'))
    borders.append(datapoint.get('border'))

#create as dataframe
df_village_border = pd.DataFrame({
    'province' : provinces,
    'district' : districts,
    'sub_district' : sub_districts,
    'village' : villages,
    'border' : borders
})
```

## Sumber data
### [Portal GIS Dukcapil](http://gis.dukcapil.kemendagri.go.id/)
