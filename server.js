// ====================================
//      Dependencies
// ====================================

const bodyParser = require("body-parser")
const logger = require("morgan")
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const googleMaps = require("@google/maps");
const geocode = require('geocoder');



// Controller Dependencies


// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Required Model
const MongoExample = require("./models/MongoExample.js");

// Initialize Express
const app = express();
// Set the port to use as a variable.
const port = process.env.PORT || 4000;


// Sets up the main handlebars page (main.hbs) to serve our web apps pages
// Sets the viewing engine of the app to handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

//Use body-parser and morgan with the app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(logger("dev"));

// ====================================
//      Database Setup with Mongoose
// ====================================

// Database configuration with mongoose
//mongoose.connect("mongodb://heroku_086slhkf:t96inaqlc3krouapt7t4uvf6rd@ds139984.mlab.com:39984/heroku_086slhkf")
//mongoose.connect('mongodb://localhost/scraper');
let connectionURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/DBHERE'


// sets timers to limit how long the server attempts to establish a connection to a db
var option = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};

mongoose.connect(connectionURI, option);
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});


// set the app to listen for a server connection
app.listen(port, function () {
  console.log('App listening on port ' + port)
});



//==========================================================
//        Nodemailer Variables
//==========================================================

// ====================================
//      Routing
// ====================================

// Homepage Route
app.get('/', function (req, res) {
  let hbsObject = {
    title: "Homepage - Michael Kallgren",
    homepage: 'active',
    results: res
  }
  // console.log("hbsObj for rendering: " + JSON.stringify(hbsObject), null, 2);
  res.render("homepage.handlebars", hbsObject);
});

app.get('/maps', function (req, res) {
  console.log(req.query)
  let query = req.query
  //console.log(googleMapsClient.directions)

  let hbsObject = {
    title: "Route Display",
    homepage: 'active',
  }

  let mapResults;

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
      hbsObject.directions = JSON.stringify(directionResults,null,2);
      hbsObject.googleClient = JSON.stringify(googleMapsClient,null,2);
      hbsObject.query = query;
      //console.log(hbsObject)
      //console.log(JSON.stringify(mapResults, null, 2))
      // console.log("hbsObj for rendering: " + JSON.stringify(hbsObject), null, 2);
      res.render("maps", hbsObject)
    });
  // });




});


// Leaving this in as an example of how to communicate with a database
//Contact-Page Route
// app.get('/contact', function (req, res) {
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
  }).then(function(err, res){
    console.log(JSON.stringify(res,null,2))
    hbsObject.src = ""
    res.render("maps", hbsObject);
  })
}



// ====================================
//      Misc
// ====================================

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyACJfX_uzwAE9msrtK1TbDz8aN9JY18zBo'
});




