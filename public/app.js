$(document).ready(function () {






    // $("#find-directions").on('click', function () {
    //     event.preventDefault();

    //     let startPlace = $("#start-loc").val().trim();
    //     let endPlace = $("#end-loc").val().trim();

    //     console.log(startPlace);
    //     console.log(endPlace);

    //     let sentData = {
    //         start: startPlace,
    //         end: endPlace,
    //     }

    //     $.ajax({
    //         type: "GET",
    //         url: "/maps",
    //         data: sentData,
    //     }).then(function (res) {
    //         console.log(res)
    //     })

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

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: { lat: 0, lng: -180 },
        mapTypeId: 'terrain'
    });

    var uluru = {lat: -25.363, lng: 131.044};

    var marker = new google.maps.Marker({
        position: uluru,
        icon: './assets/images/puppy_icon.png',
        map: map
      });
    console.log(JSON.stringify(google.maps.Marker,null,2))

    var flightPlanCoordinates = [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 }
    ];
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
}
