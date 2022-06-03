let map, infoWindow;

let secret_key = "";

function http_get(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      return callback(xmlHttp.responseText);
    } else {
      return callback(false);
    }
  };
  xmlHttp.open('GET', url, true);
  xmlHttp.send(null);
}

function markLocation(current_pos) {  
  const nv_map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: current_pos,
  });
  const marker = new google.maps.Marker({
    position: current_pos,
    map: nv_map,
  });
  const fn = openPopUp(current_pos, nv_map);
  google.maps.event.addListener(marker, 'click', fn);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
  infoWindow = new google.maps.InfoWindow();
  http_get('https://geolocation-db.com/json/', (loc) => {
    loc = JSON.parse(loc);
    if (loc) {
      const current_pos = {
        lat: loc.latitude,
        lng: loc.longitude,
      };
      markLocation(current_pos);
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleNewLocation() {
  const textDom = document.getElementById('newLocation');
  const enteredText = textDom.value;
  const locationURl =
    'http://localhost:5600/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' +
    enteredText +
    '&inputtype=textquery&fields=geometry&key='+secret_key;
  http_get(locationURl, (newLoc) => {
    if (newLoc) {
      newLoc = JSON.parse(newLoc);
      if (newLoc?.candidates[0].geometry?.location) {
        markLocation(newLoc?.candidates[0].geometry?.location);
      }
    }
    textDom.value = '';
    infoWindow.close();
  });
}

function openPopUp(current_pos, map) {
  return function (e) {
    var content =
      '<div class="wrapper">' +
      '<div> <div class="label">Enter new location</div>' +
      '<input type="text" placeholder="Enter new location" ' +
      'id="newLocation" /> ' +
      '</div>' +
      '<div class="btn-wrapper"><button class="btn" onclick="handleNewLocation()"> submit ' +
      '</button>' +
      '</div>' +
      '</div>';

    infoWindow.setContent(content);
    infoWindow.setPosition(current_pos);
    infoWindow.open(map);
  };
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
window.handleNewLocation = handleNewLocation;

window.onload = function() {
  http_get('/key' , (key) => {
    if(key) {
      secret_key = key;
      const dom = document.createElement("script");
      const parentDom = document.getElementById("body");
      dom.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key="+secret_key+"&callback=initMap&v=weekly");
      dom.setAttribute("defer", "");
      parentDom.appendChild(dom);
    }
  })
}