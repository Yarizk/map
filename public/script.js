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
var lineGroup = L.layerGroup().addTo(map);
var polygonGroup = L.layerGroup().addTo(map);
var rectangleGroup = L.layerGroup().addTo(map);
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
  console.log(rectangleArray);
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
var hand, line, marker, polygon, rectangle, circle, component, popupTemp;

function pushData() {
  var ele = document.getElementsByName("choose");
  // if (component != undefined) {
  //   component.bindPopup(
  //     popupa(component._latlngs[0].lat, component._latlngs[0].lng, ele[0].value)
  //   );
  // }
  if (store.length != 0) {
    for (var i = 0; i < ele.length; i++) {
      if (window[ele[i].value] == true && ele[i].value != "marker") {
        eval(ele[i].value + "Array.push(store)");
        eval(
          ele[i].value +
            "Popup.push(popupTemp)"
        )
        
        console.log(ele[i].value);
        console.log(polygonPopup);
        eval(ele[i].value + "Color.push(getColor())");
      }
    }
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
  lineGroup.clearLayers();
  polygonGroup.clearLayers();
  rectangleGroup.clearLayers();
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
    popupTemp = popupa(e.latlng.lat, e.latlng.lng, "line")
    drawLine(store, popupa(e.latlng.lat, e.latlng.lng, "line"), getColor());
  } else if (marker == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    markerArray.push([e.latlng.lat, e.latlng.lng]);
    markerPopup.push(popupa(e.latlng.lat, e.latlng.lng, "marker"));
    markerColor.push(document.getElementsByClassName("default")[0].src);
    addMarker(
      e.latlng.lat,
      e.latlng.lng,
      popupa(e.latlng.lat, e.latlng.lng, "marker"),
      myIcon(document.getElementsByClassName("default")[0].src)
    );
  } else if (polygon == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    popupTemp = popupa(e.latlng.lat, e.latlng.lng, "polygon")
    drawPolygon(
      store,
      popupTemp,
      getColor()
    );
  } else if (rectangle == true) {
    store.push([e.latlng.lat, e.latlng.lng]);
    if (store[1] != undefined) {
      popupTemp = popupa(e.latlng.lat, e.latlng.lng, "rectangle")
      rectanglePopup.push(popupTemp);
      rectangleArray.push(store);
      rectangleColor.push(getColor());
      drawRectangle(
        store,
        popupTemp,
        getColor()
      );
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

function popupa(lat, long, type) {
  var popupTitle = document.getElementById("inputtitle");
  var popupDescription = document.getElementById("inputDescription");
  return `
  <div>
    <h4 class="p-2">${popupTitle.value}</h4>
    <p class="p-1 m-0">${popupDescription.value}</p>
    <button class="btn btn-primary btn-sm m-1 p-1 me-0" id="${lat} ${long} ${type}" onclick="editMarker(event)">
    <i class="bi bi-pencil" id="${lat} ${long} ${type}" ></i>
    </button>
    <button class="btn btn-danger btn-sm m-1 p-1" id="${lat} ${long} ${type}" onclick="deleteMarker(event)">
    <i class="bi bi-trash3-fill" id="${lat} ${long} ${type}" ></i>
    </button>
  <div/>`;
}

function editMarker(event) {
  //edit marker
  var latlong = event.target.id.split(" ");
  var lat = latlong[0];
  var lng = latlong[1];
  var type = latlong[2];
  if (type == "marker") {
    //find index of lat lang
    var i = markerArray.findIndex((item) => item[0] == lat && item[1] == lng);
    if (markerArray[i] != undefined) {
      markerPopup[i] = popupa(lat, lng, "marker");
      markerColor[i] = document.getElementsByClassName("default")[0].src;
      markerGroup.clearLayers();
      for (let i = 0; i < markerArray.length; i++) {
        addMarker(
          markerArray[i][0],
          markerArray[i][1],
          markerPopup[i],
          myIcon(markerColor[i])
        );
      }

      axios.put(`http://localhost:3000/updateMarker/${lat}&${lng}`, {  
        title: popupa(lat, lng, "marker"),
        color: document.getElementsByClassName("default")[0].src,
      }).then((res) => {
        console.log(res);
      });
    

      document.getElementById("inputtitle").value = "";
      document.getElementById("inputDescription").value = "";

    }
  }
  else  {
    eval("var index = " + type + "Array.findIndex((item) => item[item.length-1][0] == lat && item[item.length-1][1] == lng)");
    eval(type
      + "Popup[index] = popupa(lat, lng, type)");
    eval(type
      + "Color[index] = getColor()");
    eval(type
      + "Group.clearLayers()");
    eval("for (let i = 0; i < " + type + "Array.length; i++) {draw" + type.charAt(0).toUpperCase() + type.slice(1) + "("
      + type + "Array[i],"
      + type + "Popup[i],"
      + type + "Color[i])}");

    // axios.put(`http://localhost:3000/update/${lat}&${lng}`, {
    //   title: popupa(lat, lng, type),
    //   color: getColor(),
    // }).then((res) => {
    //   console.log(res);
    // });


      
  }
}
function deleteMarker(event) {
  //getlatlong
  var latlong = event.target.id.split(" ");
  var lat = latlong[0];
  var lng = latlong[1];
  var type = latlong[2];

  if (type == "marker") {
    //find index of lat lang
    var index = markerArray.findIndex(
      (item) => item[0] == lat && item[1] == lng
    );
    //remove marker from array
    markerArray.splice(index, 1);
    markerPopup.splice(index, 1);
    markerColor.splice(index, 1);
    // remove marker from database if there is any

      axios.delete(`/deleteMarker/${lat}&${lng}`).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
        ;

    //remove marker from map
    markerGroup.clearLayers();
    for (let i = 0; i < markerArray.length; i++) {
      addMarker(
        markerArray[i][0],
        markerArray[i][1],
        markerPopup[i],
        myIcon(markerColor[i])
      );
    }
  } 
  else {
    eval(
      "var index = " +
        type +
        "Array.findIndex((item) => item[item.length-1][0] == lat && item[item.length-1][1] == lng)"
    );
    eval(type + "Array.splice(index, 1)");
    eval(type + "Popup.splice(index, 1)");
    eval(type + "Color.splice(index, 1)");
    eval(type + "Group.clearLayers()");
    for (let i = 0; i < eval(type + "Array.length"); i++) {
      eval(
        "draw" + type.charAt(0).toUpperCase() + type.slice(1) +"(" +type +"Array[i], " +type +"Popup[i], " +type +"Color[i])"
      );
    }
  }
}

function getColor() {
  var color = document.getElementById("color-picker").value;
  if (color == "") {
    color = "red";
  }
  return color;
}

function addMarker(lat, long, popup, icon) {
  component = L.marker([lat, long], { icon: icon })
    .bindPopup(popup)
    .addTo(map)
    .on("click", function (e) {
      map.panTo(e.latlng);
    });
  component.addTo(markerGroup);
}
function drawLine(array, popup, color) {
  component = L.polyline(array, { color: color }).bindPopup(popup).addTo(map);
  component.addTo(lineGroup);
}
function drawPolygon(array, popup, color) {
  component = L.polygon(array, { color: color }).bindPopup(popup).addTo(map);
  component.addTo(polygonGroup);
}
function drawRectangle(array, popup, color) {
  component = L.rectangle(array, { color: color }).bindPopup(popup).addTo(map);
  component.addTo(rectangleGroup);
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
        markerArray.push(data[j].coordinates);
        markerPopup.push(data[j].popup);
        markerColor.push(data[j].color);
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
  const s = saveComponent();
  // clear();
  s != undefined ? document.getElementsByClassName("warning")[0].textContent = "No data to save" : document.getElementsByClassName("warning")[0].textContent = "Data saved successfully";
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
      .catch((err) => unathorizedPost(err));
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
      .catch((err) => {
        throw unathorizedPost(err);
      });
  }

  if (
    !markerArray.length &&
    !lineArray.length &&
    !polygonArray.length &&
    !rectangleArray.length
  ) {
    return "No data to save";
  }
}

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
