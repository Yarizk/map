var map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: 2,
  maxZoom: 5,
  zoomSnap: 0.3,
  maxBounds: [
    [-100, -170],
    [100, 170],
  ],
});

var bounds = [
  [-85, -150],
  [85, 150],
];
var image = L.imageOverlay("2.jpg", bounds).addTo(map);
map.fitBounds(bounds);
var layerGroup = L.layerGroup().addTo(map);
var markerGroup = L.layerGroup().addTo(map);

function choose() {
  pushData();
  var ele = document.getElementsByName("choose");
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
  markerArray = [],
  handArray = [],
  handPopup = [],
  markerPopup = [],
  linePopup = [],
  polygonPopup = [],
  rectanglePopup = [];
var store = [];
var hand, line, marker, polygon, rectangle, circle,component;

function pushData() {
  if (component != undefined) {
  component.bindPopup(popupa()).openPopup();}
  var ele = document.getElementsByName("choose");
  if (store.length != 0) {
    for (var i = 0; i < ele.length; i++) {
      console.log(ele[i].value);
      // fix thisssssssss markerpopup rectangle popup
      if (window[ele[i].value] == true) {
        eval(ele[i].value + "Array.push(store)");
        eval(ele[i].value + "Popup.push(popupa())");
      }
    }
  }
  if(rectangle == true && rectangleArray.length !=0){
    rectanglePopup.push(popupa())
  }
  console.log(rectanglePopup);
}

function reset() {
  markerGroup.clearLayers();
  layerGroup.clearLayers();
  lineArray = [];
  polygonArray = [];
  rectangleArray = [];
  markerArray = [];
  markerPopup = [];
  linePopup = [];
  polygonPopup = [];
  rectanglePopup = [];
  store = [];
}

map.on("click", function (e) {
  alert([e.latlng.lat, e.latlng.lng])
  if (line == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    drawLine(store, popupa());
  } else if (marker == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    markerArray.push([e.latlng.lat, e.latlng.lng]);
    // markerPopup.push(popupa());
    addMarker(e.latlng.lat, e.latlng.lng, popupa());
  } else if (polygon == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    drawPolygon(store, popupa());
  } else if (rectangle == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    if (store[1] != undefined) {
      // rectanglePopup.push(popupa());
      rectangleArray.push(store);
      drawRectangle(store, popupa());
      store = [];
    }
  }
});

function popupa() {
  var popup = document.getElementById("inputtitle");
  return `<p>${popup.value}<p/>`;
}

function addMarker(lat, long, popup) {
  component = L.marker([lat, long]).bindPopup(popup).addTo(map);
  component.addTo(markerGroup);
}
function drawLine(array, popup) {
  component = L.polyline(array, { color: "red" }).bindPopup(popup).addTo(map);
  component.addTo(layerGroup);
}
function drawPolygon(array, popup) {
  component = L.polygon(array, { color: "red" }).bindPopup(popup).addTo(map);
  component.addTo(layerGroup);
}
function drawRectangle(array, popup) {
  component = L.rectangle(array, { color: "red" })
    .bindPopup(popup)
    .addTo(map);
  component.addTo(layerGroup);
}

async function get() {
  const response = await axios.get("http://localhost:3000/get");
  const data = response.data;
  for (let j = 0; j < data.length; j++) {
    for (let i = 0; i < data[j].marker.coordinates.length; i++) {
      L.marker(data[j].marker.coordinates[i])
        .bindPopup(data[j].marker.popup[i])
        .addTo(markerGroup);
    }
    for (let i = 0; i < data[j].line.coordinates.length; i++) {
      drawLine(data[j].line.coordinates[i], data[j].line.popup[i]);
    }
    for (let i = 0; i < data[j].polygon.coordinates.length; i++) {
      drawPolygon(data[j].polygon.coordinates[i], data[j].polygon.popup[i]);
    }
    for (let i = 0; i < data[j].rectangle.coordinates.length; i++) {
      if (data[j].rectangle.coordinates[i] == undefined) {
        continue;
      } else {
        drawRectangle(
          data[j].rectangle.coordinates[i],
          data[j].rectangle.popup[i]
        );
      }
    }
  }
}

//post data with axios
function save() {
  pushData();
  store = [];
  var data = {
    marker: { popup: markerPopup, coordinates: markerArray },
    line: { popup: linePopup, coordinates: lineArray },
    polygon: { popup: polygonPopup, coordinates: polygonArray },
    rectangle: { popup: rectanglePopup, coordinates: rectangleArray },
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
