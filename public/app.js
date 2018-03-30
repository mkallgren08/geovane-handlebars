//console.log(window.document)

$(document).ready(function () {
    // $("#find-directions").on('click', function (event) {
    //     event.preventDefault();
    //     console.log('click heard!')

    //     let startPlace = $("#start-loc").val().trim();
    //     let endPlace = $("#end-loc").val().trim();

    //     console.log(startPlace);
    //     console.log(endPlace);

    //     if (!startPlace||!endPlace){
    //         alert("Error!")
    //         return;
    //     } else {
    //         let sentData = {
    //             start: startPlace,
    //             end: endPlace,
    //         }
    //     }

    // })
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




