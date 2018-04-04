$(document).ready(function () {

});



//=========================================
//       FUNCTIONS
//=========================================

function pageLoad() {
    console.log('Page loaded!')
    let input1 = document.getElementById('start-loc');
    let input2 = document.getElementById('end-loc')

    let autoStart = new google.maps.places.Autocomplete(input1)
    let autoEnd = new google.maps.places.Autocomplete(input2)
}

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






