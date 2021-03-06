// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap;
var markers = [];

var data;
processData([
  {
    id: '1',
    brin: '676576',
    bevoegdGezag: 0,
    name: 'Frank Wijmans',
    address: {
      streetname: 'Comeniusstraat',
      streetNr: '809/3',
      zipcode: '1065 CH',
      city: 'Amsterdam'
    },
    geo: {
      latitude: 52.3589661,
      longitude: 4.823281,
    },
    totaalAantalLeerlingen: 1,
    fteDirectie: 1.533,
    fteLeerkrachten: 1.533,
    fteInOpleiding: 1.533,
    fteOndersteunend: 1.533,
    fteOnbekend: 1.533,
    bekostigingPersoneel: 1.533,
    bekostigingDirectie: 1.533,
    bekostigingOverig: 1.533,
    totalMaterialInstantHolding: 234.34,
    ratings: {
      classSize: 2,
      incomePerStudent: 769787,
      nonPersonelCostsPerStudent: 8765876,
      fteBoardPerFteTeacher: 3,
      costsBoardPerCostsPersonel: 1,
      citoPerClassSize: 5
    }
  },
  {
    address: {
      zipcode: '2511 CL',
      streetNr: '',
      streetname: '',
      city: ''
    },
    geo: {
      latitude: 52.0786467,
      longitude: 4.3144497
    }
  }
  ,
  {
    address: {
      zipcode: '3824 DK',
      streetNr: '',
      streetname: '',
      city: ''
    },
    geo: {
      latitude: 52.1947546,
      longitude: 5.3777556
    }
  }
  ,
  {
    address: {
      zipcode: '1223 GK',
      streetNr: '',
      streetname: '',
      city: ''
    },
    geo: {
      latitude: 52.2308983,
      longitude: 5.1991128
    }
  }
  ,
  {
    address: {
      zipcode: '1316 LG',
      streetNr: '',
      streetname: '',
      city: ''
    },
    geo: {
      latitude: 52.3850857,
      longitude: 5.2258091
    }
  }
  ,
  {
    address: {
      zipcode: '1087 MN',
      streetNr: '',
      streetname: '',
      city: ''
    },
    geo: {
      latitude: 52.347334,
      longitude: 5.0077305
    }
  }
]);

function processData(rawData, callback) {
  var newData = rawData
      .filter(item => {
        return item.geo && item.geo != null
      }).map(item => {

        item.totalIncome = 0;
        if (item.bekostigingPersoneel) item.totalIncome += item.bekostigingPersoneel;
        if (item.bekostigingDirectie) item.totalIncome += item.bekostigingDirectie;
        if (item.bekostigingOverig) item.totalIncome += item.bekostigingOverig;
        if (item.totalMaterialInstantHolding) item.totalIncome += item.totalMaterialInstantHolding;

        return item;
      });
  data = newData;
  console.log(data);
  if (callback) {
    callback();
  }
}


var url = 'http://localhost:8080';
var schoolResource = url + '/schools?start=0&size=5000';

function fetchSchools() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', schoolResource);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      processData(JSON.parse(xhr.responseText), initMap);
    } else {
      console.error('Request error', xhr.status);
    }
  };
}
fetchSchools();

var heatMapLayer;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 52.2, lng: 5.5},
    mapTypeId: 'terrain'
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(data),
    map: map
  });

  addMarkers(data);
  clearMarkers(document.getElementById('markerCheckbox'));

}


function addMarkers(markerData) {
  markerData.map(item => addMarker(item));
}

function isInfoWindowOpen(infoWindow) {
  var map = infoWindow.getMap();
  return (map !== null && typeof map !== "undefined");
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleMarkers(e) {
  if (e.checked) {
    showMarkers();
  } else {
    clearMarkers();
  }
}

// Adds a marker to the map and push to the array.
function addMarker(item) {

  var createElement = (value, element) => {

    if (value && value != undefined) {
      return '<' + element + '>' + value + '</' + element + '>';
    } else {
      return '';
    }
  };

  var createTableRow = item => createElement(item, 'tr');
  var createHeader = item => createElement(item, 'h1');


  if (!item.name) {
    item.name = 'School zonder Naam';
  }

  var infoContent = '';

  infoContent += createHeader(item.name);
  if (item.brin) {
    infoContent += '<small> BRIN: ' + item.brin + '  </small>';
  }
  if (item.address) {
    infoContent += '<p>' + item.address.streetname + ' ' + item.address.streetNr + '<br/>' + item.address.zipcode + '<br/>' + item.address.city;
  }

  infoContent += "<table>";
  if (item.ratings.totalIncome) {
    infoContent += createTableRow('<td>Inkomen</td><td>€  ' + item.totalIncome + '</td>');
  }

  if (item.ratings.classSize) {
    infoContent += createTableRow('<td>Klassegrootte </td><td>' + item.ratings.classSize + '</td>');
  }

  if (item.ratings.incomePerStudent) {
    infoContent += createTableRow('<td>Inkomen per leerling </td><td>' + item.ratings.incomePerStudent + '</td>');
  }

  if (item.ratings.nonPersonelCostsPerStudent) {
    infoContent += createTableRow('<td>Niet-persoonlijke kosten per leerling </td><td>' + item.ratings.nonPersonelCostsPerStudent + '</td>');
  }

  if (item.ratings.fteBoardPerFteTeacher) {
    infoContent += createTableRow('<td>Directie/leraren </td><td>' + item.ratings.fteBoardPerFteTeacher + '</td>');
  }

  if (item.ratings.costsBoardPerCostsPersonel) {
    infoContent += createTableRow('<td>Kosten Directie/leraren </td><td>' + item.ratings.costsBoardPerCostsPersonel + '</td>');
  }

  if (item.ratings.citoPerClassSize) {
    infoContent += createTableRow('<td>Cito per Klasgrootte </td><td>' + item.ratings.citoPerClassSize + '</td>');
  }

  infoContent += "</table>";
  var infowindow = new google.maps.InfoWindow({
    content: infoContent
  });


  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(item.geo.latitude, item.geo.longitude),
    map: map,
    title: getMarkerName(item)
  });

  marker.addListener('click', function () {
    if (isInfoWindowOpen(infowindow)) {
      infowindow.close();
    } else {
      infowindow.open(map, marker);
    }
  });

  markers.push(marker);
}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Sets the map on all markers in the array.
function setMapOnMarker(map, marker) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].title == marker) {
      markers[i].setMap(map);
    }
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(checker) {
  setMapOnAll(null);
  if (checker) {
    checker.checked = false;
  }
}

// Shows any markers currently in the array.
function showMarkers(checker) {
  setMapOnAll(map);

  if (checker) {
    checker.checked = true;
  }
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ];
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

// Heatmap data: 500 Points
function getPoints(pointData) {
  return pointData.map(item => {
        return {
          location: new google.maps.LatLng(item.geo.latitude, item.geo.longitude),
          weight: getWeight(item)
        }
      }
  );
}

var ratingType = 'incomePerStudent';

function getWeight(item) {
  var weight = 1;
  if (item.ratings && item.ratings['classSize']) {
    weight = item.ratings[ratingType];
  }
  return weight;
}

function setRatingType(type) {
  //console.log(type);
  ratingType = type;
  heatmap.setData(getPoints(data));
}

function findMarker() {
  clearMarkers();
  var searchValue = document.getElementById('searchBox').value.toLowerCase();
  data.filter(item => item.name)
      .forEach((item) => {
        var searches = [];

        if (item.name) {
          searches.push(item.name.toLowerCase());
        }
        if (item.address && item.address.city) {
          searches.push(item.address.city.toLowerCase());
        }

        searches.map(value => {
          if(value.indexOf(searchValue) != -1){
            //console.log(searchValue, value, item);
            setMapOnMarker(map, getMarkerName(item));
          }
        });
      });

}
 function getMarkerName(item){
  return item.name + '-'+item.geo.latitude+','+item.geo.longitude;
 }