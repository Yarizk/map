//import axios


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
var image = L.imageOverlay("2.jpg", bounds).addTo(map);
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
  rectangleArray = [],
  markerArray = [];
var hand, line, marker, polygon, rectangle, circle;

function reset() {
  layerGroup.clearLayers();
  lineArray = [];
  polygonArray = [];
  rectangleArray = [];
  markerArray = [];
}

//post data with axios
function save() {
  var data = {
    marker: markerArray,
    line: lineArray,
    polygon: polygonArray,
    rectangle: rectangleArray,
  };
  console.log(data);
  axios
    .post("http://localhost:3000/save", data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });}

function draw() {
  map.on("click", function (e) {
    if (line == true) {
      lineArray.push([e.latlng.lat, e.latlng.lng]);
      drawLine(lineArray);
    } else if (marker == true) {
      markerArray.push([e.latlng.lat, e.latlng.lng]);
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
      L.circle([e.latlng.lat, e.latlng.lng], 5000, circleOptions).addTo(map);
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

// //different style markers
// var myIcon = L.icon({
//   iconUrl: "marker.png",
//   iconSize: [38, 95],
//   iconAnchor: [22, 94],
//   popupAnchor: [-3, -76],
//   shadowUrl: "marker-shadow.png",
//   shadowSize: [68, 95],
//   shadowAnchor: [22, 94],
// });

//get data with axios with async await
async function load() {
  const res = await axios.get("http://localhost:3000/load");
  console.log(res.data);
  var data = res.data;
  for (var i = 0; i < data.marker.length; i++) {
    L.marker(data.marker[i], { icon: myIcon }).addTo(map);
  }
  for (var i = 0; i < data.line.length; i++) {
    lineArray.push(data.line[i]);
  }
  drawLine(lineArray);
  for (var i = 0; i < data.polygon.length; i++) {
    polygonArray.push(data.polygon[i]);
  }
  drawPolygon(polygonArray);
  for (var i = 0; i < data.rectangle.length; i++) {
    rectangleArray.push(data.rectangle[i]);
  }
  drawRectangle(rectangleArray);
}
