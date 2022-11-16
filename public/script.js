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
var image = L.imageOverlay("3.png", bounds).addTo(map);
map.fitBounds(bounds);
var layerGroup = L.layerGroup().addTo(map);
var markerGroup = L.layerGroup().addTo(map);
var handGroup = L.layerGroup().addTo(map);

function choose() {
  document.getElementsByClassName("warning")[0].textContent = "";
  pushData();
  var ele = document.getElementsByName("choose");
  store = [];
  for (i = 0; i < ele.length; i++) {
    if (!ele[i].checked) {
      window[ele[i].value] = false;
    } else if (ele[i].checked) {
      window[ele[i].value] = true;
    }

    if (window[ele[i].value] == true && ele[i].value == "marker") {
      document.getElementsByClassName("choose-marker")[0].disabled = false;
    } else if (window[ele[i].value] == true && ele[i].value != "marker") {
      document.getElementsByClassName("choose-marker")[0].disabled = true;
    }

    if (
      window[ele[i].value] == true &&
      ele[i].value != "marker" &&
      ele[i].value != "hand"
    ) {
      document.getElementById("color-picker").disabled = false;
    } else if (
      (window[ele[i].value] == true && ele[i].value == "marker") ||
      ele[i].value == "hand"
    ) {
      document.getElementById("color-picker").value = "";
      document.getElementById("color-picker").disabled = true;
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
(markerColor = []),
  (lineColor = []),
  (polygonColor = []),
  (rectangleColor = []);

var store = [];
var hand, line, marker, polygon, rectangle, circle, component;

function pushData() {
  if (component != undefined) {
    component.bindPopup(popupa());
  }
  var ele = document.getElementsByName("choose");
  if (store.length != 0) {
    for (var i = 0; i < ele.length; i++) {
      if (window[ele[i].value] == true && ele[i].value != "marker") {
        eval(ele[i].value + "Array.push(store)");
        eval(ele[i].value + "Popup.push(popupa())");
        eval(ele[i].value + "Color.push(getColor())");
      }
    }
  }
  if (rectangle == true && rectangleArray.length != 0) {
    rectanglePopup.push(popupa());
    rectangleColor.push(getColor());
  }
  component = undefined;
}

function resetInput() {
  document.getElementById("inputtitle").value = "";
  document.getElementById("inputDescription").value = "";
  var ele = document.getElementsByName("choose");
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      ele[i].checked = false;
    }
  }
}

function reset() {
  resetInput();
  markerGroup.clearLayers();
  layerGroup.clearLayers();
  clear();
}
function clear() {
  lineArray = [];
  polygonArray = [];
  rectangleArray = [];
  markerArray = [];
  markerPopup = [];
  linePopup = [];
  polygonPopup = [];
  rectanglePopup = [];
  markerColor = [];
  lineColor = [];
  polygonColor = [];
  rectangleColor = [];
  handArray = [];
  store = [];
  document.getElementsByClassName("warning")[0].textContent =
    "Component cleared";
}

// async await axios call
async function getTemp(lat, long) {
  const response = await axios.get(
    `https://fcc-weather-api.glitch.me/api/current?lat=${parseInt(
      lat
    )}&lon=${parseInt(long)}`
  );
  return [
    (parseInt(response.data.main.temp) * 5) / 4 + " °C",
    response.data.weather[0].main,
    response.data.weather[0].icon,
  ];
}
async function getAQI(lat, long) {
  const response = await axios.get(
    `https://api.waqi.info/feed/geo:${lat};${long}/?token=4b425bd3bd6267a0e9211736d91ccea0ecf19308`
  );
  if (response.data.data.aqi >= 0 && response.data.data.aqi < 50) {
    return response.data.data.aqi + " (Baik)";
  } else if (response.data.data.aqi >= 50 && response.data.data.aqi < 100) {
    return response.data.data.aqi + " (Sedang)";
  } else if (response.data.data.aqi >= 100 && response.data.data.aqi < 150) {
    return response.data.data.aqi + " (Tidak Sehat)";
  } else if (response.data.data.aqi >= 150 && response.data.data.aqi < 200) {
    return response.data.data.aqi + " (Sangat Tidak Sehat)";
  } else if (response.data.data.aqi >= 200) {
    return response.data.data.aqi + " (Berbahaya)";
  } else {
    return "Tidak Tersedia";
  }
}

map.on("click", async function (e) {
  handGroup.clearLayers();
  var aqi, temp;
  if (hand == true) {
    aqi = await getAQI(e.latlng.lat, e.latlng.lng);
    temp = await getTemp(e.latlng.lat, e.latlng.lng);
    L.marker([e.latlng.lat, e.latlng.lng], {
      icon: myIcon("./marker/default.png"),
    })
      .bindTooltip(
        `<div><h2 class="tooltip-Style">Map Information</h2>
        <p>Temp : ${temp[0]}<br/>Weather : ${temp[1]} <br/> AQI : ${aqi}<p/> 
        <img src="${temp[2]}" alt="weather icon" width="50" height="50"> <div/>`
      )
      .addTo(handGroup);
  } else if (line == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    drawLine(store, popupa(), getColor());
  } else if (marker == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    markerArray.push([e.latlng.lat, e.latlng.lng]);
    markerPopup.push(popupa());
    markerColor.push(document.getElementsByClassName("default")[0].src);
    addMarker(
      e.latlng.lat,
      e.latlng.lng,
      popupa(),
      myIcon(document.getElementsByClassName("default")[0].src)
    );
  } else if (polygon == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    drawPolygon(store, popupa(), getColor());
  } else if (rectangle == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    if (store[1] != undefined) {
      rectangleArray.push(store);
      drawRectangle(store, popupa(), getColor());
      store = [];
    }
  }
  if (aqi == undefined) {
    aqi = await getAQI(e.latlng.lat, e.latlng.lng);
    temp = await getTemp(e.latlng.lat, e.latlng.lng);
  }
  document.getElementById("inputTemp").value = temp[0];
  document.getElementById("inputWeather").value = temp[1];
  document.getElementById("inputWeatherImg").src = temp[2];
  document.getElementById("inputAir").value = aqi;
});

// custom map marker
function myIcon(marker) {
  let icon = L.icon({
    iconUrl: marker,
    iconSize: [30, 40],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
  return icon;
}

function popupa() {
  var popupTitle = document.getElementById("inputtitle");
  var popupDescription = document.getElementById("inputDescription");
  return `
  <div>
    <h4>${popupTitle.value}</h4>
    <p>${popupDescription.value}</p>
  <div/>`;
}

function getColor() {
  var color = document.getElementById("color-picker").value;
  if (color == "") {
    color = "red";
  }
  return color;
}

function addMarker(lat, long, popup, icon) {
  component = L.marker([lat, long], { icon: icon }).bindPopup(popup).addTo(map);
  component.addTo(markerGroup);
}
function drawLine(array, popup, color) {
  component = L.polyline(array, { color: color }).bindPopup(popup).addTo(map);
  component.addTo(layerGroup);
}
function drawPolygon(array, popup, color) {
  component = L.polygon(array, { color: color }).bindPopup(popup).addTo(map);
  component.addTo(layerGroup);
}
function drawRectangle(array, popup, color) {
  component = L.rectangle(array, { color: color }).bindPopup(popup).addTo(map);
  component.addTo(layerGroup);
}

for (
  var i = 0;
  i < document.getElementsByClassName("icon-marker").length;
  i++
) {
  document
    .getElementsByClassName("icon-marker")
    [i].addEventListener("click", function (item) {
      console.log(item.target.src);
      document.getElementsByClassName("default")[0].src = item.target.src;
    });
}

async function get() {
  resetInput();
  const response = await axios.get("/get");
  document.getElementsByClassName("warning")[0].textContent =
    "Data loaded successfully";
  const data = response.data;

  for (let j = 0; j < data.length; j++) {
    if (data[j].type == "marker") {
      if (data[j].popup[i] != null) {
        addMarker(
          data[j].coordinates[0],
          data[j].coordinates[1],
          data[j].popup,
          myIcon(data[j].color)
        );
      } else {
        L.marker(data[j].coordinates, { icon: myIcon() }).addTo(markerGroup);
      }
    }
    if (data[j].type == "line") {
      drawLine(data[j].coordinates, data[j].popup, data[j].color);
    }
    if (data[j].type == "polygon") {
      drawPolygon(data[j].coordinates, data[j].popup, data[j].color);
    }
    if (data[j].type == "rectangle") {
      if (data[j].coordinates == undefined) {
        continue;
      } else {
        drawRectangle(data[j].coordinates, data[j].popup, data[j].color);
      }
    }
  }
}

//post data with axios
function save() {
  pushData();
  resetInput();
  store = [];
  saveComponent();
  // clear();
  // document.getElementsByClassName("warning")[0].textContent =
  //   "Data saved successfully";
}

function saveComponent() {
  for (var i = 0; i < markerArray.length; i++) {
    var payload = {
      type: "marker",
      color: markerColor[i],
      popup: markerPopup[i],
      coordinates: markerArray[i],
    };
    axios
      .post("/save", payload)
      .then((res) => {
        console.log("marker succes" + res);
      })
      .catch((err) => unathorizedPost(err));
  }
  for (var i = 0; i < lineArray.length; i++) {
    var payload = {
      type: "line",
      color: lineColor[i],
      popup: linePopup[i],
      coordinates: lineArray[i],
    };
    axios
      .post("/save", payload)
      .then((res) => {
        console.log("line succes" + res);
      })
      .catch((err) =>  unathorizedPost(err));
  }
  for (var i = 0; i < polygonArray.length; i++) {
    var payload = {
      type: "polygon",
      color: polygonColor[i],
      popup: polygonPopup[i],
      coordinates: polygonArray[i],
    };
    axios
      .post("/save", payload)
      .then((res) => {
        console.log("polygon succes" + res);
      })
      .catch((err) => unathorizedPost(err));
  }
  for (var i = 0; i < rectangleArray.length; i++) {
    var payload = {
      type: "rectangle",
      color: rectangleColor[i],
      popup: rectanglePopup[i],
      coordinates: rectangleArray[i],
    };
    axios
      .post("/save", payload)
      .then((res) => {
        console.log("rectangle succes" + res);
      })
      .catch((err) => {throw unathorizedPost(err)});
  }

  if(!markerArray.length && !lineArray.length && !polygonArray.length && !rectangleArray.length){
    document.getElementsByClassName("warning")[0].textContent =
    "No data to save";
}}

function unathorizedPost(err) {
  console.log(err);
  document.getElementsByClassName("warning")[0].textContent =
    "You harus register to nyimpen data";
  const href = document.createElement("a");
  href.setAttribute("href", "/register");
  href.textContent = "Register here";
  const br = document.createElement("br");
  document.getElementsByClassName("warning")[0].appendChild(br);
  document.getElementsByClassName("warning")[0].appendChild(href);
}
// for(var i = 0; i < markerGroup.getLayers().length; i++){
//   markerArray.push(markerGroup.getLayers()[i]._latlng);
//   markerPopup.push(markerGroup.getLayers()[i]._popup._content);
//   markerColor.push(markerGroup.getLayers()[i]._icon.src);
// }

// var data = {
//   marker: { color:markerColor, popup: markerPopup, coordinates: markerArray },
//   line: { color : lineColor, popup: linePopup, coordinates: lineArray },
//   polygon: { color: polygonColor, popup: polygonPopup, coordinates: polygonArray },
//   rectangle: { color : rectangleColor, popup: rectanglePopup, coordinates: rectangleArray },
// };

// axios
//     .post("/save", data)
//     .then((res) => {
//       console.log("post succes" + res);
//       clear();
//       document.getElementsByClassName("warning")[0].textContent =
//       "Data saved";
//     })
//     .catch((err) => {
//       console.log(err);
//       document.getElementsByClassName("warning")[0].textContent =
//         "You harus register to nyimpen data";
//       const href = document.createElement("a");
//       href.setAttribute("href", "/register");
//       href.textContent = "Register here";
//       const br = document.createElement("br");
//       document.getElementsByClassName("warning")[0].appendChild(br);
//       document.getElementsByClassName("warning")[0].appendChild(href);
//     });
