var map;

$(document).ready(function () {
    //console.log("Directions: " + JSON.stringify(passedData.directions, null, 2));
    // console.log(passedData.query)
});



let legs = passedData.directions.routes[0].legs[0]
//console.log("Legs: " + JSON.stringify(legs, null, 2));
//console.log(legs.start_address)
// ===================================
//          FUNCTIONS
// ===================================

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var selectedMode = $('#mode').val();
    let mapOrigin;

    let reStart = document.getElementById('restart').value
    let reEnd = document.getElementById('reend').value
    let routeStart = legs.start_address;
    let routeEnd = legs.end_address;
    let startLatLng = legs.start_location;
    let endLatLng = legs.end_location;

    //console.log(selectedMode);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: { lat: 0, lng: 0 },
        gestureHandling: 'cooperative'
    });

    console.log("First instance of map:" + map);

    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, routeStart, routeEnd, map)

    var onChangeHandler = function () {
        var selectedMode = $('#mode').val();
        if (reStart === "") {
            routeStart = legs.start_address
        } else {
            routeStart = reStart
        }
        if (reEnd === "") {
            routeEnd = legs.end_address
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
let weatherInfo = [];

function calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, start, end, map) {
    //console.log('SelectedMode: ' + selectedMode);
    // console.log('Start: ' + start);
    // console.log('End: ' + end)

    //------------------------------------------------
    // creates an array of locations for weather calls
    //------------------------------------------------
    weatherInfo = [];
    let locations = [];

    //console.log(markers);


    directionsService.route({
        origin: start,
        destination: end,
        travelMode: selectedMode
    }, function (response, status) {
        if (status === 'OK') {
            //console.log("markers (before delete): " + markers)
            if (selectedMode !== 'DRIVING' || !selectedMode) {
                $('#mode').val(selectedMode);
            } else {
                $('#mode').val("DRIVING");
            }

            deleteMarkers()
            //console.log("markers (after delete): " + markers)
            //console.log(response);
            directionsDisplay.setDirections(response);
            console.log(response)
            // This assembles the array of locations to pass to our OpenWeatherMap API to get the weather!
            let steps = response.routes[0].legs[0].steps;
            console.log(steps)
            for (var i = 0; i < steps.length; i++) {
                if (steps[i].distance.value > 8000) {
                    let location = {};
                    let lat = steps[i].end_location.lat()
                    //console.log(lat)
                    location.lat = lat;

                    let lng = steps[i].end_location.lng()
                    //console.log(lng)
                    location.lng = lng;

                    locations.push(location)
                }
            }

            //console.log(locations)
            for (var j = 0; j < locations.length; j++) {
                weatherMapsAPICall(locations[j].lat, locations[j].lng, map)
            }

            //console.log('Weather Results:')
            ///console.log(weatherInfo)

            // let halfway = Math.floor((steps.length) / 2);
            // let midpoint = steps[halfway].end_location
            // //console.log("markers: ")
            // addMarker(midpoint, map)
            // // //console.log(markers)


        } else {
            window.alert('Directions request failed due to ' + status);
        }

        //===============================================
        //      MAP RENDERING FUNCTIONS
        //===============================================

        // Adds a marker to the map and push to the array.
        function addMarker(location, map) {
            console.log(location)
            console.log(map)
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            markers.push(marker);
            console.log(markers)

        }

        function addWeatherMarkers(weatherRes, map) {
            //console.log("Weather Results: " + JSON.stringify(weatherRes,null,2))
            let lat = weatherRes.coord.lat;
            let lng = weatherRes.coord.lon;

            var iconcode = weatherRes.weather[0].icon;
            var location = new google.maps.LatLng(lat,lng)

            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: "http://openweathermap.org/img/w/" + iconcode + ".png"
            });
            markers.push(marker);
            marker.setMap(map)
            console.log("Markers: " + markers)

        }

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                //console.log(markers[i].map)
            }
            console.log("Old markers should all disappear here")
            console.log("Markers: " + markers)
            console.log("Now clearing the marker array")
            markers = [];
            console.log("Markers: " + markers)
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            console.log('Setting all markers to map "null"')
            setMapOnAll(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            console.log("Delete function called on markers!")
            clearMarkers();
        }

        // ====================================
        //     WEATHER RENDERING FUNCTIONS
        // ====================================

        function weatherMapsAPICall(latitude, longitude, map) {
            //var cityName = $("#startLocation").val().trim();
            // var latitude = $("#startLat").val().trim();

            console.log('Weather API call launched')

            var APIKey = "f29cdafe21624061235bd7d34ec68e05";

            var stepDistances = []

            var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=" + APIKey +
                "&lat=" + latitude + "&lon=" + longitude;


            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function (response) {
                //console.log(response);
                //console.log(response.coord);
                //console.log(response.coord.lat);
                let location = {};
                location.lat = response.coord.lat;
                location.lng = response.coord.lon;
                //console.log(typeof location.lat)
                console.log(location);


                addWeatherMarkers(response, map)
                //addMarker(location,map)

            });
        };

    });

};

var promiseArr = [];


