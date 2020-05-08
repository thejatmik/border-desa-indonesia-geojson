unzip indonesia_villages_border.geojson.zip
rm -rf __MACOSX
rm -rf geojson

echo "Setup geojson folders"
mkdir geojson
mv indonesia_villages_border.geojson geojson/
echo "geojson ready on ./borders/"
