var map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: 3,
  zoomSnap: 0.3,
  maxBounds: [
    [-50, -20],
    [1000, 1600],
  ]});
var bounds = [
  [0, 0],
  [1000, 1500],
];
var image = L.imageOverlay("/assets/2.jpg", bounds).addTo(map);
map.fitBounds(bounds);

var layerGroup = L.layerGroup().addTo(map);

function choose() {
  var ele = document.getElementsByName("choose");
  for (i = 0; i < ele.length; i++) {
    if (!ele[i].checked) {
      window[ele[i].value] = false;
    } else if (ele[i].checked) {
      window[ele[i].value] = true;
      draw();
    }
  }
}

var lineArray = [],
  polygonArray = [],
  rectangleArray = [];
var hand, line, marker, polygon, rectangle, circle;

function draw() {
  map.on("click", function (e) {
    if (line == true) {
      lineArray.push([e.latlng.lat, e.latlng.lng]);
      drawLine(lineArray);
    } else if (marker == true) {
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    } else if (polygon == true) {
      polygonArray.push([e.latlng.lat, e.latlng.lng]);
      drawPolygon(polygonArray);
    } else if (rectangle == true) {
      rectangleArray.push([e.latlng.lat, e.latlng.lng]);
      drawRectangle(rectangleArray);
    } else if (circle == true) {
      var circleOptions = {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0,
      };
      L.circle([e.latlng.lat, e.latlng.lng], 5000000000, circleOptions).addTo(map);
    }
  });
}

function drawLine(array) {
  var line = L.polyline(array, { color: "red" }).addTo(map);
  line.addTo(layerGroup);
}
function drawPolygon(array) {
  var polygon = L.polygon(array, { color: "red" }).addTo(map);
  polygon.addTo(layerGroup);
}
function drawRectangle(array) {
  var rectangle = L.rectangle(array, { color: "red" }).addTo(map);
  rectangle.addTo(layerGroup);
}
