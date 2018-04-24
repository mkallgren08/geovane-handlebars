const express= require("express");
let router = express.Router();

const googleMaps = require("@google/maps");
const geocode = require('geocoder');


// ====================================
//      Routing
// ====================================

// Homepage Route
router.get('/', function (req, res) {
    let hbsObject = {
        title: "Geovane",
        homepage: 'active',
        results: res,
    }
    // console.log("hbsObj for rendering: " + JSON.stringify(hbsObject), null, 2);
    //res.render("homepage.handlebars", hbsObject);
    res.render('maps.handlebars')
});

router.get('/maps', function (req, res) {
    console.log(req.query)
    let query = req.query
    //console.log(googleMapsClient.directions)
    let hbsObject = {
        title: "Route Display",
        homepage: 'active',
    }

    let mapResults;


    if (!query.start || !query.end) {
        let routeStEn = {
            start: query.start,
            end: query.end
        }

        let alertMsg = "Please make sure to enter a valid location for both a start and end location!"

        let hbsObject = {
            title: "Route Display",
            homepage: 'active',
            alert: alertMsg,
            route: routeStEn,
        }
        res.render("homepage", hbsObject)
    } else {
        googleMapsClient.directions({
            origin: query.start,
            destination: query.end,
            mode: "driving",
        }, function (err, response) {
            if (err) {
                console.log("Error: " + JSON.stringify(err, null, 2));
            }

            let directionResults = response.json
            //console.log(directionResults)
            hbsObject.directions = JSON.stringify(directionResults, null, 2);
            hbsObject.query = query;
            hbsObject.steps = JSON.stringify(directionResults.routes[0].legs[0].steps, null, 2);
            //console.log(hbsObject)
            //console.log(JSON.stringify(mapResults, null, 2))
            // console.log("hbsObj for rendering: " + JSON.stringify(hbsObject), null, 2);
            res.render("maps", hbsObject)
        });
    }



    // Geocode an address.
    // googleMapsClient.geocode({
    //   address: '1600 Amphitheatre Parkway, Mountain View, CA'
    // }, function (err, response) {
    //   if (err) {
    //     console.log("Error: " + JSON.stringify(err, null, 2));
    //   }
    //   mapResults = response.json.results
    //   latilongi = mapResults[0].geometry.location
    //   //console.log(JSON.stringify(mapResults, null, 2))
    //   hbsObject.results=  JSON.stringify(mapResults, null, 2);
    //   hbsObjects.latlng= JSON.stringify(latilongi, null, 2),

    //   // console.log("hbsObj for rendering: " + JSON.stringify(hbsObject), null, 2);
    //   // Geocode an address.
    // });




});


// Leaving this in as an example of how to communicate with a database
//Contact-Page Route
// router.get('/contact', function (req, res) {
//   Code.find({})
//     // Now, execute the rest of the query
//     .exec(function (error, result) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Or send the doc to the browser as a json object
//       else {
//         let hbsObject = {
//           title: "Contact - Michael Kallgren",
//           contact: 'active',
//           results: result
//         }
//         console.log("hbsObj for rendering: " + JSON.stringify(hbsObject, null, 2));
//         res.render("contact.handlebars", hbsObject);
//       }
//     });

// });


//+++++++++++++++++++++++++++++++++++++++++++++++++

// ====================================
//      Functions
// ====================================

testmap = (hbsObject) => {
    $.ajax({
        method: 'GET',
        url: "https://www.google.com/maps/embed/v1/directions?key=AIzaSyACJfX_uzwAE9msrtK1TbDz8aN9JY18zBo&origin=Oslo+Norway&destination=Telemark+Norway&avoid=tolls|highways"
    }).then(function (err, res) {
        console.log(JSON.stringify(res, null, 2))
        hbsObject.src = ""
        res.render("maps", hbsObject);
    })
}



// ====================================
//      Misc
// ====================================

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyACJfX_uzwAE9msrtK1TbDz8aN9JY18zBo'
});

module.exports = router;