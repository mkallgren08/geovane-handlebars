// Clear localStorage
//localStorage.clear();

// Store all content into localStorage
//localStorage.setItem("name", name);

// By default display the content from localStorage
//$("#name-display").text(localStorage.getItem("name"));

var map;

$(document).ready(function () {
    console.log(localStorage)


    //SETS THE MAIN MAP'S DIV TO BE RESIZEABLE
    $('#map').resizable();

    //localStorage.removeItem("geovane-time")

    //SETS A TIMESTAMP TO HOLD DATA IN LOCAL STORAGE
    let timeNow = new Date();
    timeNow.toISOString();

    //CHECKS THE OLD TIMESTAMP AND REFRESHES IT IF OLDER THAN A DAY
    console.log(timeNow)
    let timestamp = localStorage.getItem("geovane-time");


    if (!timestamp || timeNow > moment(timestamp).add(24, 'hours')) {
        localStorage.removeItem("geovane-start")
        localStorage.removeItem("geovane-end")
        localStorage.setItem("geovane-time", timeNow)

        console.log(localStorage)
    }


    // $('#reroute').on('click', function(){
    //     $("#map").switchClass('display-none','display-block')
    //     initMap()
    // })
});


//let legs = passedData.directions.routes[0].legs[0]
//console.log("Legs: " + JSON.stringify(legs, null, 2));
//console.log(legs.start_address)
// ===================================
//          FUNCTIONS
// ===================================

function setAllAutoComs() {
    console.log('Autocomplete set-up fired!')
    let input1 = setAutoComplete("restart");
    let input2 = setAutoComplete("reend");
};

function setGeovaneLocalStorage(start, end, method) {
    localStorage.setItem("geovane-start", start)
    localStorage.setItem("geovane-end", end)
    localStorage.setItem("geovane-method", method)
    console.log(localStorage)
}


function initMap() {
    setAllAutoComs();

    //console.log(selectedMode);

    // THE MAP IS THE FIRST THING THAT NEEDS TO BE INITIALIZED
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: { lat: 0, lng: 0 },
        gestureHandling: 'cooperative'
    });

    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer({
        // PREVENTS DEFAULT MARKERS FROM BEING SPAWNED
        suppressMarkers: true,
        // SETS THE DIRECTIONS DISPLAY TO THE PAGE'S MAP
        map: map
    });


    let storedStart = localStorage.getItem("geovane-start");
    let storedEnd = localStorage.getItem("geovane-end");
    let storedMethod = localStorage.getItem("geovane-method");

    if (storedStart && storedEnd && storedMethod) {
        $('#restart').val(storedStart);
        $('#reend').val(storedEnd);
        $('#mode').val(storedMethod)
        calculateAndDisplayRoute(directionsService, directionsDisplay, storedMethod, storedStart, storedEnd, map)
    };

    let selectedMode = $('#mode').val();
    let mapOrigin;
    let startPoint = document.getElementById('restart').value;
    let endPoint = document.getElementById('reend').value;

    let routeStart = startPoint;
    let routeEnd = endPoint;





    // console.log("First instance of map:" + map);

    // directionsDisplay.setMap(map);
    // calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, routeStart, routeEnd, map)

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

        setGeovaneLocalStorage(routeStart, routeEnd, selectedMode);

        calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, routeStart, routeEnd, map);
    };

    var onvalChange = function () {
        reStart = document.getElementById('restart').value;
        console.log(reStart)
        reEnd = document.getElementById('reend').value;
        console.log(reEnd)

    }

    document.getElementById('restart').addEventListener('change', onvalChange);
    document.getElementById('reend').addEventListener('change', onvalChange);
    document.getElementById('mode').addEventListener('change', onChangeHandler);

    $('#reroute').on('click', function () {
        //we call onvalChange here to grab the auto-completed values located in the input boxes.
        onvalChange();
        setGeovaneLocalStorage(reStart, reEnd, selectedMode);
        calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, reStart, reEnd, map);
    });
}
// array of markers for the map
let markers = [];
let weatherInfo = [];

function calculateAndDisplayRoute(directionsService, directionsDisplay, selectedMode, start, end, map) {
    console.log('SelectedMode: ' + selectedMode);
    console.log('Start: ' + start);
    console.log('End: ' + end)

    //------------------------------------------------
    // creates an array of locations for weather calls
    //------------------------------------------------
    weatherInfo = [];
    let locations = [];

    //console.log(markers);

    // intiate the route method of the directionsService object - actually calculates the route
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: selectedMode,
        provideRouteAlternatives: true,
    }, function (response, status) {
        if (status === 'OK') {
            //console.log("markers (before delete): " + markers)

            //CHECKS THE SELECTED MODE OF THE DIRECTIONS REQUEST - SETS IT TO 
            // 'DRIVING' IF NO MODE EXPLICITY SELECTED/AVAILABLE
            if (selectedMode !== 'DRIVING' || !selectedMode) {
                $('#mode').val(selectedMode);
            } else {
                $('#mode').val("DRIVING");
            };

            //THIS IS AN OLD CONSOLE.LOG CHECK TO MAKE SURE THE DIRECTIONS-TEXT TABLE COULD 
                //BE MANIPULATED AS PART OF THE DOM
                // if ($("#directionsText")) {
                //     console.log("I can communicate with the directions table!")
                // } else {
                //     console.log("I can't communicate with the directions table :(")
                // }

            //

                // CLEARS THE MAP OF MARKERS
            deleteMarkers()

            // OLD CONSOLE LOGS TO CHECK THAT THE DELETE MARKERS FUNCTIONS WORKED

                //console.log("markers (after delete): " + markers)
                //console.log(response);
            //


            // SETS THE BOUNDS OF THE DISPLAYED MAP TO THE BOUNDS FOUND IN THE DIRECTION RESPONSE
            let bounds = response.routes[0].bounds
            map.fitBounds(bounds)

            // TAKES THE DIRECTIONS FROM THE DIRECTIONS SERVICE AND SETS THEM TO A GOOGLE MAPS OBJECT
            directionsDisplay.setDirections(response);
            console.log(response)

            // THIS STEP STARTS TO PULL THE DATA FROM THE RESPONSE AND PASS IT TO THE DOM FOR USER DISPLAY
            let steps = response.routes[0].legs[0].steps;
            console.log(steps)

            // THIS ADDS A CONSOLE LOG FOR THE TABLE HEADERS, JUST TO SEE HOW THEY CAN BE USED IN THE DIRECTIONS
            // TABLE CREATION LATER.
            tableManager.logHeaders();

            //CLEARS THE TABLE OF DIRECTIONS
            tableManager.clearTable();

            for (var i = 0; i < steps.length; i++) {
                //console.log("Step for directions: " + JSON.stringify(steps[i], null, 2));
                // PRINTS OUT A TABLE OF RESULTS
                //console.log("Should be creating new rows here")
                tableManager.createRow(steps[i], i)


                // THESE SUB-STEPS ASSEMBLE AN ARRAY OF GEOGRAPHICAL COORDINATES TO SEND TO OPENWEATHERMAPS TO GET WEATHER DATA
                // GETS THE COORDINATES AT THE STARTING LOCATION
                if (i === 0) {
                    let location = tableManager.makeMarkedLocation(i, steps)
                    locations.push(location)
                }

                // GETS THE COORDINATES AT THE END LOCATION
                let endStep = steps.length - 1;
                if (i === endStep) {
                    let location = tableManager.makeMarkedLocation(i, steps)
                    locations.push(location)
                }


                // GETS THE LOCATION FOR A STEP WHOSE DISTANcE IS GREATER THAN 24 KM (14.91 MILES) AND
                // CALCULATES THE MIDPOINT BETWEEN IT'S START LOCATION AND END LOCATION (NOT A PERFECT SYSTEM
                // BUT GENERALLY FOLLOWS THE TRACK OF THE ROUTE WELL ENOUGH TO NOT BE TOO FAR OFF-COURSE)
                // AND AS DEFAULT CASE PUTS THE LOCATION INTO THE ARRAY WITH A MARKER_FLAG EQUAL TO 'FALSE'
                // THIS LETS THE DATA BE PUT INTO THE TABLE BUT NOT CLUTTER UP THE MAP

                if (steps[i].distance.value > 24000 && i !== 0) {
                    // find the coordinal midpoint between the step's start and end location to do a weather search
                    let midpoint = {};

                    // define the final and origin latitudes of the midpoint's endpoints
                    let latf = steps[i].end_location.lat();
                    let lato = steps[i].start_location.lat();

                    // calculate latitude midpoint
                    let latm = (latf + lato) / 2
                    //console.log("Midpoint lat: " + latm)

                    // define the final and origin longitudes of the midpoint's endpoints
                    let lngf = steps[i].end_location.lng();
                    let lngo = steps[i].start_location.lng();

                    // calculate longitude midpoint
                    let lngm = (lngf + lngo) / 2
                    //console.log("Midpoint lng: " + lngm)

                    midpoint.lat = latm;
                    midpoint.lng = lngm;
                    midpoint.number = i
                    midpoint.marker = true;

                    locations.push(midpoint)
                }

                // GETS THE LOCATION FOR A STEP WHOSE DISTANcE IS GREATER THAN 10 KM (6.21 MILES)
                else if (steps[i].distance.value > 10000 && i !== (steps.length - 1)) {
                    let location = tableManager.makeMarkedLocation(i, steps)
                    locations.push(location)
                } else {
                    let location = tableManager.makeUnMarkedLocation(i, steps)
                    locations.push(location)
                };
            };

            console.log(locations)

            //TAKES THE LOCATIONS ARRAY CONSTRUCTED IN THE PREVIOUS STEP AND MAKES 
            // WEATHER CALLS FOR ITEMS IN THE ARRAY
            for (var j = 0; j < locations.length; j++) {
                weatherMapsAPICall(locations[j], map)
            }
        } else {
            // LOGS AN ERROR IF NO VALID DIRECTIONS WERE FOUND - CURRENTLY AN ALERT, WILL BE CHANGED TO A MODAL POP-UP
            window.alert('Directions request failed due to ' + status);
        }

        //===============================================
        //      MAP RENDERING FUNCTIONS
        //===============================================

        // ADDS A STANDARD GOOGLE MAPS MARKER TO THE MAP ARRAY FOR FUTURE RENDERING
        function addMarker(location, map) {
            //console.log(location)
            //console.log(map)
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            markers.push(marker);
            //console.log(markers)

        }

        // ADDS A CUSTOMIZED MARKER (WITH WEATHER DATA) TO THE MAP ARRAY FOR FUTURE RENDERING
        function addWeatherMarkers(weatherRes, map, callLocation) {
            // console.log("Weather Results: " + JSON.stringify(weatherRes,null,2));
            let lat = weatherRes.coord.lat;
            let lng = weatherRes.coord.lon;

            var iconcode = weatherRes.weather[0].icon;
            var location = new google.maps.LatLng(lat, lng)

            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: "http://openweathermap.org/img/w/" + iconcode + ".png"
            });
            markers.push(marker);
            marker.setMap(map)
            //console.log("Markers: " + markers)

            if (callLocation.number !== undefined) {
                let target = "row" + callLocation.number;
                tableManager.updateWeatherCells(target, weatherRes);
            };


        }

        // FUNCTION TO SET WHICH MAP ON THE PAGE (IN THIS CASE THERE IS ONLY ONE MAP) ALL THE 
        // MARKERS IN THE MAP ARRAY ARE DISPLAYED ON.
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

        function weatherMapsAPICall(location, map) {
            //var cityName = $("#startLocation").val().trim();
            // var latitude = $("#startLat").val().trim();
            let latitude = location.lat;
            let longitude = location.lng

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
                // let location = {};
                // location.lat = response.coord.lat;
                // location.lng = response.coord.lon;
                //console.log(typeof location.lat)
                //console.log(location);

                console.log(location)

                if (location.marker === true) {
                    addWeatherMarkers(response, map, location)
                } else {
                    if (location.number !== undefined) {
                        let target = "row" + location.number;
                        tableManager.updateWeatherCells(target, response);
                    };
                }

                //addMarker(location,map)

            });
        };

    });

};

const tableManager = {
    // CREATES A ROW FOR THE TABLE
    createRow: function (data, j) {
        //console.log('Row data: ' + JSON.stringify(data, null, 2));
        let mainTableBody = $('#directionsTextBody');
        let newRow = $("<tr>");
        newRow.attr({
            class: "directionsText-row",
            id: "row" + j
        });

        // FINDS THE NUMBER OF <th> TAGS IN THE TABLE HEADER AND USES THAT NUMBER 
        // TO CREATE CELLS IN EACH ROW
        let tableCellNum = $("#directions-header-row").find(".directions-header").length;

        let testOutput = $("#directions-header-row").html()

        //console.log("the array of table header children is: " )
        //console.log(testOutput)
        //console.log("Number of children in header row: " + tableCellNum)
        //console.log(tableCellNum)

        for (let i = 0; i < tableCellNum; i++) {
            let newCell = this.createCell(data, j, i);
            //console.log("Created new cell")
            newRow.append(newCell);
            //console.log("Appending new cell")
        }

        mainTableBody.append(newRow)

    },
    // CREATES A CELL FOR THE TABLE
    createCell: function (data, j, i) {
        //console.log("Cell data: " + JSON.stringify(data, null, 2));
        let newCell = $('<td>');
        newCell.attr({
            class: "directionsText-cell",
        });

        let text = $("<p>");

        // Checks if data is found
        if (!data) {
            text.text("Data not found!")
            newCell.append(text)
            return newCell
        } else {
            switch (i) {
                // Set the directions
                case 0:
                    newCell.attr({
                        id: "row" + j + "-directions",
                    });

                    text.html(data.instructions)
                    newCell.append(text)

                    break;

                // Set the distance (km) - add a miles version in the future
                case 1:
                    newCell.attr({
                        id: "row" + j + "-distance",
                    });

                    text.text(data.distance.text)
                    newCell.append(text)

                    break;

                // Sets the intial weather (blank at first!)
                case 2:
                    newCell.attr({
                        id: "row" + j + "-weather",
                        class: "empty-weather"
                    });

                    //adds a loading symbol
                    newCell.append(this.insertLoadIcon())

                    break;
                // Sets the intial weather icon (blank at first!)
                case 3:
                    newCell.attr({
                        id: "row" + j + "-weatherIcon",
                        class: "empty-weatherIcon"
                    });

                    //adds a loading symbol
                    newCell.append(this.insertLoadIcon())

                    break;
                // Time display
                case 4:
                    newCell.attr({
                        id: "row" + j + "-time",
                    });

                    text.text(data.duration.text)
                    newCell.append(text)

                    break;
                case 5:
                    newCell.attr({
                        id: "row" + j + "-totalTime",
                    });

                    text.text("filler")
                    newCell.append(text)

                    break;
            }
            return newCell
        }
    },
    updateCell: function (targetRow, targetCell, data) {



    },
    updateWeatherCells: function (targetRow, data) {
        //console.log("Weather Results: " + JSON.stringify(data,null,2))
        console.log("Target row: " + targetRow)

        //UPDATE THE WEATHER CELL
        let weatherCellID = "#" + targetRow + "-weather"
        let weatherIconCellID = "#" + targetRow + "-weatherIcon"

        let Cell1 = $(weatherCellID);
        Cell1.empty();
        if (Cell1.attr('class') === "full-weather") {
            Cell1.switchClass('full-weather', 'empty-weather')
        };

        let forecast = data.weather[0].main
        Cell1.text(forecast)
        Cell1.switchClass('empty-weather', 'full-weather')

        //ADD A WEATHER ICON
        let Cell2 = $(weatherIconCellID)
        Cell2.empty();
        if (Cell2.attr('class') === "full-weatherIcon") {
            Cell2.switchClass('full-weatherIcon', 'empty-weatherIcon')
        };


        let iconcode = data.weather[0].icon
        let iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png"

        let newIcon = $("<img>");
        newIcon.attr({
            src: iconURL,
            alt: data.weather[0].description
        });

        Cell2.append(newIcon);
        Cell2.switchClass('empty-weatherIcon', 'full-weatherIcon');



    },
    clearTable: function () {
        $('#directionsTextBody').empty();
    },
    logHeaders: function () {
        let tableHeaders = $("#directions-header-row").children();

        console.log("tableHeaders: " + JSON.stringify(tableHeaders, null, 2));
    },
    insertLoadIcon: function () {
        let img = $('<img>');
        img.attr({
            alt: "Loading icon",
            src: "./assets/images/loading-icon.gif",
            style: "width: 30px; height: 30px",
            class: "loading-icon"
        });

        return img;
    },
    makeMarkedLocation: function (i, steps) {
        let location = {};
        let lat = steps[i].start_location.lat()
        //console.log(lat)
        location.lat = lat;

        let lng = steps[i].start_location.lng()
        //console.log(lng)
        location.lng = lng;

        location.number = i;

        location.marker = true;

        return location;
    },
    makeUnMarkedLocation: function (i, steps) {
        let location = {};
        let lat = steps[i].start_location.lat()
        //console.log(lat)
        location.lat = lat;

        let lng = steps[i].start_location.lng()
        //console.log(lng)
        location.lng = lng;

        location.number = i;

        location.marker = false;

        return location;
    }
}

function setAutoComplete(htmlID) {
    // NOTE: We have to use document.getElementByID instead of jQuery's $.() method because
    // jQuery and Google Maps don't play so nice when used directly together.
    let autoComElem = document.getElementById(htmlID);
    let tag = new google.maps.places.Autocomplete(autoComElem)
    return tag;
};


