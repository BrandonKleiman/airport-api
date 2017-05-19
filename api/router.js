const myRouter = require('express').Router();
const db = require('./db');
const models = require('./schema');


// Problem 2:
  // Write and document an endpoint that is able to efficiently return a JSON-formatted
  // response of airports within a given radius of a specific coordinate.
  // The iOS supplied information should be:
    // Latitude
    // Longitude
    // Radius
  // example: localhost:8000/api/airports?lat=42.290763&long=-71.35368&r=20

myRouter.route('/airports')
  .get((req, res) => {
    if (!req.query.lat || req.query.lat < -90 || req.query.lat > 90) {
      res.sendStatus(400);
      res.send('Invalid value: Latitude. Please enter a value between -90 - 90');
    }
    if (!req.query.long || req.query.long < -180 || req.query.long > 180) {
      res.sendStatus(400);
      res.send('Invalid value: Longitude. Please enter a value between -180 - 180');
    }
    if (!req.query.r || req.query.r <= 0) {
      res.sendStatus(400);
      res.send('Invalid value: Radius. Please enter a value greater than 0');
    }
    db.query(`select *, 
      ( 6371 * acos( cos( radians(${req.query.lat}) ) * cos( radians( Airports.latitude ) ) 
      * cos( radians(Airports.longitude) - radians(${req.query.long})) + sin(radians(${req.query.lat})) 
      * sin( radians(Airports.latitude)))) AS distance 
      from Airports
      HAVING distance < ${req.query.r}
      ORDER BY distance;`,
      { type: db.QueryTypes.SELECT })
    .then((airports) => {
      res.send(airports);
    })
    .catch((err) => {
      res.sendStatus(500);
      res.send('Unable to process request');
    });
  });

// Problem 3:
  // Write and document an endpoint that is able to return a JSON-formatted
  // response with the distance between two supplied airport id’s.
  // The iOS supplied information should be:
    // Airport 1 ID
    // Airport 2 ID
//localhost:8000/api/distance?apid1=8280&apid2=8265

myRouter.route('/distance')
  .get((req, res) => {
    models.Airports.findOne({
      where: { id: req.query.apid1 },
    })
    .then((id1) => {
      models.Airports.findOne({
        where: { id: req.query.apid2 },
      })
      .then((id2) => {
        const dist = getDistanceFromLatLonInKm(id1.latitude, id1.longitude, id2.latitude, id2.longitude);
        res.send(dist.toString());
      })
      .catch((err) => {
        res.sendStatus(400);
        res.send('Invalid input for: Airport ID 2');
      });
    })
    .catch((err) => {
      res.sendStatus(400);
      res.send('Invalid input for: Airport ID 1');
    });
  });



// Problem 4:
  // Write and document an endpoint that is able to return a JSON-formatted response with the geographically closest airports between two countries. For example, if tasked to compare the airports in the United States and Mexico, the endpoint would find the 1 airport in each country that is the shortest distance from the airport in the opposite country. The iOS supplied information should be:
    // Country 1 Name
    // Country 2 Name
// Example: localhost:8000/api/countries?c1=United%20States&c2=Mexico


myRouter.route('/countries')
  .get((req, res) => {
    models.Airports.findAll({
      where: { country: req.query.c1}
    })
    .then((apts1) => {
      if (apts1.length === 0) {
        res.send("No results found")
        return;
      }
      models.Airports.findAll({
        where: { country: req.query.c2}
      })
      .then((apts2) => {
        if (apts2.length === 0) {
          res.send("No results found");
          return;
        }
        var storage = {}
        var minDist = null;
        var closestA = null;
        var closestB = null;
        for (let i=0; i<apts1.length; i++) {
          for (let j=0; j<apts2.length; j++) {
            var tmpDist = getDistanceFromLatLonInKm(apts1[i].latitude, apts1[i].longitude, apts2[j].latitude, apts2[j].longitude);
            if (minDist === null || tmpDist < minDist) {
              closestA = apts1[i]
              closestB = apts2[j]
              minDist = tmpDist;
            }
          }
        }
        res.send([closestA, closestB]);
      })
      .catch((err) => {
        res.sendStatus(400)
        res.send("Invalid input: Country 2")
      })
    })
    .catch((err) => {
        res.sendStatus(400)
        res.send("Invalid input: Country 1")
    })
  })

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = myRouter;
