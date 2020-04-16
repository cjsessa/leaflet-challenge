var myMap = L.map("map", {
  center: [10, -40],
  zoom: 3
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
// layer is the skin
// attribution is sourcing
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.pirates",
  accessToken: API_KEY
}).addTo(myMap);

var jsonData;
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  // createFeatures(data.features);
  jsonData = data;

  data.features.forEach(obj => {
    var lat = obj.geometry.coordinates[1];
    var lng = obj.geometry.coordinates[0];
    var mag = obj.properties.mag;
    var place = obj.properties.place;

    L.circle([lat, lng], {
      stroke: false,
      fillOpacity: .75,
      color: getColor(mag),
      fillColor: getColor(mag),
      radius: mag * 60000
    }).bindPopup("<h2>" + place + "<h2><h2>Magnitude: " + mag + "</h2>").addTo(myMap);
  });
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

function getColor(d) {
  return d > 5 ? '#800026' :
         d > 4  ? '#BD0026' :
         d > 3  ? '#E31A1C' :
         d > 2  ? '#FC4E2A' :
         d > 1   ? '#FD8D3C' :
         d > 0   ? '#FEB24C' :
                    '#FFEDA0';
}
