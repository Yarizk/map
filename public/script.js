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
  var ele = document.getElementsByName("choose");
  for(var i = 0; i < ele.length; i++){
    if(window[ele[i].value] == true){
      eval(ele[i].value + "Array.push(store)");
    }
  }
  console.log(markerArray);
  console.log(lineArray);
  console.log(polygonArray);
  console.log(rectangleArray);
  store = [];

  for (i = 0; i < ele.length; i++) {
    if (!ele[i].checked) {
      window[ele[i].value] = false;

    } else if (ele[i].checked) {
      window[ele[i].value] = true;


    }
  }
}


var lineArray = [],
  polygonArray = [],
  rectangleArray = [],
  markerArray = [];
  handArray = [];
var store = [];
var hand, line, marker, polygon, rectangle, circle;

function reset() {
  layerGroup.clearLayers();
  lineArray = [];
  polygonArray = [];
  rectangleArray = [];
  markerArray = [];
  store = [];
}

map.on("click", function (e) {

    console.log(polygonArray);
    if (line == true) {
      store.push([e.latlng.lat, e.latlng.lng]);
      drawLine(store);
    } else if (marker == true) {
      markerArray.push([e.latlng.lat, e.latlng.lng]);
      L.marker([e.latlng.lat, e.latlng.lng]).bindPopup("aaa").addTo(map);
      console.log(markerArray);
    } else if (polygon == true) {
      store.push([e.latlng.lat, e.latlng.lng]);
      drawPolygon(store);
    } else if (rectangle == true) {
      store.push([e.latlng.lat, e.latlng.lng]);
      if (store[1] != undefined) {
        drawRectangle(store);
        rectangleArray.push(store);
        store = [];
      }
    }
  
});

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


async function get() {
  const response = await axios.get("http://localhost:3000/get");
  const data = response.data;
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
  // console.log(data);
  axios
    .post("http://localhost:3000/save", data)
    .then((res) => {
      console.log("post succes" + res);
    })
    .catch((err) => {
      console.log(err);
      document.getElementsByClassName("warning")[0].textContent =
        "You harus register to nyimpen data";
      const href = document.createElement("a");
      href.setAttribute("href", "/register");
      href.textContent = "Register here";
      const br = document.createElement("br");
      document.getElementsByClassName("warning")[0].appendChild(br);
      document.getElementsByClassName("warning")[0].appendChild(href);
    });
}
