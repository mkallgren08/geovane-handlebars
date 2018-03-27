//console.log(window.document)

$(document).ready(function () {
    $("#find-directions").on('click', function (event) {
        event.preventDefault();
        console.log('click heard!')

        let startPlace = $("#start-loc").val().trim();
        let endPlace = $("#end-loc").val().trim();

        console.log(startPlace);
        console.log(endPlace);

        if (!startPlace||!endPlace){
            alert("Error!")
            return;
        } else {
            let sentData = {
                start: startPlace,
                end: endPlace,
            }
    
            $.ajax({
                type: "GET",
                url: "/maps",
                data: sentData,
            })
        }

    })
});

// initMap()

//=========================================
//       FUNCTIONS
//=========================================


let addEvent = function (object, type, callback) {
    if (object == null || typeof (object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on" + type] = callback;
    }
}

// function initMap() {
//     var uluru = {lat: -25.363, lng: 131.044};
//     var map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 4,
//       center: uluru
//     });
//     var marker = new google.maps.Marker({
//       position: uluru,
//       map: map
//     });
//   }

// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 3,
//         center: { lat: 0, lng: -180 },
//         mapTypeId: 'terrain'
//     });

//     var uluru = {lat: -25.363, lng: 131.044};

//     var marker = new google.maps.Marker({
//         position: uluru,
//         icon: './assets/images/puppy_icon.png',
//         map: map
//       });
//     console.log(JSON.stringify(google.maps.Marker,null,2))

//     var flightPlanCoordinates = [
//         { lat: 37.772, lng: -122.214 },
//         { lat: 21.291, lng: -157.821 },
//         { lat: -18.142, lng: 178.431 },
//         { lat: -27.467, lng: 153.027 }
//     ];
//     var flightPath = new google.maps.Polyline({
//         path: flightPlanCoordinates,
//         geodesic: true,
//         strokeColor: '#FF0000',
//         strokeOpacity: 1.0,
//         strokeWeight: 2
//     });

//     flightPath.setMap(map);
// }

// let mapLoaded = true;
// // var haight = new google.maps.LatLng(37.7699298, -122.4469157);
// // var oceanBeach = new google.maps.LatLng(37.7683909618184, -122.51089453697205);

// function initMap() {
//     var selectedMode = document.getElementById('mode').value;
//     var directionsService = new google.maps.DirectionsService();
//     var directionsDisplay = new google.maps.DirectionsRenderer();
//     let routeStart = 
//     var mapOptions = {
//       zoom: 14,
//       center: haight
//     }
//     var map = new google.maps.Map(document.getElementById('map'), mapOptions);
//     directionsDisplay.setMap(map);
//     var request = {
//         origin: haight,
//         destination: oceanBeach,
//         // Note that Javascript allows us to access the constant
//         // using square brackets and a string value as its
//         // "property."
//         travelMode: google.maps.TravelMode[selectedMode]
//     };
//     directionsService.route(request, function(response, status) {
//       if (status == 'OK') {
//         directionsDisplay.setDirections(response);
//       }
//     });
//   }


function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var selectedMode = $('#mode').val();
    let mapOrigin;

    let reStart = document.getElementById('restart').value
    let reEnd = document.getElementById('reend').value
    let routeStart = "";
    let routeEnd = ""

    if (reStart.length < 1) {
        routeStart = "the hague"
    } else {
        routeStart = reStart;
    }

    if (reEnd.length < 1) {
        routeEnd = "leiden"
    } else {
        routeEnd = reEnd;
    }
    console.log(selectedMode);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 52.1429, lng: 4.4012 }
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, routeStart, routeEnd, map)

    var onChangeHandler = function () {
        var selectedMode = $('#mode').val();
        if (reStart === ""){
            routeStart = "the hague"
        } else {
            routeStart = reStart
        }
        if (reEnd === ""){
            routeEnd = "leiden"
        } else {
            routeEnd = reEnd
        }
        
        calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, routeStart, routeEnd, map);
    };

    var onvalChange = function () {
        reStart = document.getElementById('restart').value
        //console.log(reStart)
        reEnd = document.getElementById('reend').value
        //console.log(reEnd)

    }

    document.getElementById('restart').addEventListener('change', onvalChange);
    document.getElementById('reend').addEventListener('change', onvalChange);
    document.getElementById('mode').addEventListener('change', onChangeHandler);

    $('#reroute').on('click', function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, reStart, reEnd, map)
    });
}
// array of markers for the map
let markers = [];

function calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, start, end, map) {
    console.log('SelectedMode: ' + selectedMode);
    console.log('Start: ' + start);
    console.log('End: ' + end)
    // creates an array of markers
    
    console.log(markers);


    directionsService.route({
        origin: start,
        destination: end,
        travelMode: selectedMode
    }, function (response, status) {
        if (status === 'OK') {
            console.log("markers (before delete): " + markers)
            deleteMarkers()
            console.log("markers (after delete): " + markers)
            console.log(response);
            directionsDisplay.setDirections(response);
            let steps = response.routes[0].legs[0].steps
            let halfway = Math.floor((steps.length) / 2);
            let midpoint = steps[halfway].end_location
            addMarker(midpoint, map)
            console.log(markers)

        } else {
            window.alert('Directions request failed due to ' + status);
        }



        // Adds a marker to the map and push to the array.
        function addMarker(location, map) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            markers.push(marker);
            
        }

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                console.log(markers[i].map)
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setMapOnAll(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            clearMarkers();
            markers = [];
        }



    });

}

