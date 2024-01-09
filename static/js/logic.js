// Create a map centered around a specific location
var myMap = L.map('map').setView([0, 0], 2);

// Add a base map tile layer (you can choose other tile layers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Replace 'YOUR_JSON_URL' with the actual URL of the earthquake data JSON
var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Function to determine the color based on the depth of the earthquake
function getColor(depth) {
    return depth > 100 ? '#d73027' :
           depth > 50  ? '#fc8d59' :
           depth > 20  ? '#fee08b' :
                         '#91cf60';
  }
  
  // Function to determine the size based on the magnitude of the earthquake
  function getSize(magnitude) {
    // Scale the magnitude to a reasonable range for radius
    var scaledMagnitude = Math.min(Math.max(magnitude, 1), 10);
  
    // Map the scaled magnitude to a radius range
    return scaledMagnitude * 30000;
  }

// Use D3.js to fetch the earthquake data
d3.json(earthquakeDataUrl).then(data => {
  data.features.forEach(feature => {
    var coordinates = feature.geometry.coordinates;
    var magnitude = feature.properties.mag;
    var depth = coordinates[2];

    var circle = L.circle([coordinates[1], coordinates[0]], {
      color: null,
      fillColor: getColor(depth),
      fillOpacity: 0.5,
      radius: getSize(magnitude)
    }).addTo(myMap);

    // Add a popup with additional information
    circle.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth}`);
  });
});

// Add a legend (customize it based on your depth-color mapping)
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (myMap) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = `
  <h4>Depth Legend</h4>
  <div><i style="background: #91cf60"></i> 0-20 km</div>
  <div><i style="background: #fee08b"></i> 20-50 km</div>
  <div><i style="background: #fc8d59"></i> 50-100 km</div>
  <div><i style="background: #d73027"></i> 100+ km</div>
`
  return div;
};

legend.addTo(myMap);
