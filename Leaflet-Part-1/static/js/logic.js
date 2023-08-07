// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Console log the data retrieved 
  console.log(data);
  // Perform createFeatures function on data.features object
  createFeatures(data.features);
});

// Function to determine marker size baseed on magnitude
function markerSize(magnitude) {
  return magnitude * 20000;
};

// Function to determine marker color by depth
function chooseColor(depth){
  if (depth < 10) return "#00FF00";
  else if (depth < 30) return "#9dff00";
  else if (depth < 50) return "#f6ff00";
  else if (depth < 70) return "#ff9900";
  else if (depth < 90) return "#ff5e00";
  else return "#FF0000";
}

function createFeatures(earthquakeData) {

  // Define a function to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Point to layer used to alter markers
    pointToLayer: function(feature, latlng) {

      // Determine the style of markers based on properties
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.65,
        color: "black",
        stroke: true,
        weight: 0.3
      }
      return L.circle(latlng,markers);
    }
  });

  // Send earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create tile layer
  let maplayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create the map, add maplayer and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
        35.37, -92.56
    ],
    zoom: 4.3,
    layers: [maplayer, earthquakes]
  });

  // Add legend
  // to do

};