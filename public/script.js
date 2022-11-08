

var map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: 3,
  zoomSnap: 0.3,
  maxBounds: [
    [-50, -20],
    [1000, 1600],
  ],
});
var bounds = [
  [0, 0],
  [1000, 1500],
];
var image = L.imageOverlay("2.jpg", bounds).addTo(map);
map.fitBounds(bounds);
var layerGroup = L.layerGroup().addTo(map);

function choose() {
  store = [];
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
var store = [];
var hand, line, marker, polygon, rectangle, circle;

function reset() {
  layerGroup.clearLayers();
  lineArray = [];
  polygonArray = [];
  rectangleArray = [];
  markerArray = [];
}

function draw() {
  map.on("click", function (e) {
    if (line == true) {
      store.push([e.latlng.lat, e.latlng.lng]);
      lineArray.push(store);
      drawLine(lineArray);
    } else if (marker == true) {
      markerArray.push([e.latlng.lat, e.latlng.lng]);
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    } else if (polygon == true) {
      store.push([e.latlng.lat, e.latlng.lng]);
      polygonArray.push(store);
      drawPolygon(polygonArray);
    } else if (rectangle == true) {
      store.push([e.latlng.lat, e.latlng.lng]);
      if (store[1] != undefined) {
        rectangleArray.push(store);
        console.log(rectangleArray);
        drawRectangle(store);
        store = [];
      }
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


async function get() {
  const response = await axios.get("http://localhost:3000/get");
  const data = response.data;
  console.log(data);
  for (let j = 0; j < data.length; j++) {
    for (let i = 0; i < data[j].marker.length; i++) {
      L.marker(data[j].marker[i]).addTo(map);
    }
    for (let i = 0; i < data[j].line.length; i++) {
      drawLine(data[j].line[i]);
    }
    for (let i = 0; i < data[j].polygon.length; i++) {
      drawPolygon(data[j].polygon[i]);
    }
    for (let i = 0; i < data[j].rectangle.length; i++) {
      drawRectangle(data[j].rectangle[i]);
    }
  }
}

//post data with axios
function save() {
  
  store = [];
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
      lineArray = [];
      polygonArray = [];
      rectangleArray = [];
      markerArray = [];
      
    })
    .catch(() => {
      document.getElementsByClassName("warning")[0].textContent = "You harus register to nyimpen data";
      const href = document.createElement("a");
      href.setAttribute("href", "/register");
      href.textContent = "Register here";
      const br = document.createElement("br");
      document.getElementsByClassName("warning")[0].appendChild(br);
      document.getElementsByClassName("warning")[0].appendChild(href)
      
    });
}