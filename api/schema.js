const Sequelize = require('sequelize');
const db = require('./db.js');

const Airports = db.define('Airports', {
  airport_name: Sequelize.STRING,
  city: Sequelize.STRING,
  country: Sequelize.STRING,
  iata_faa: Sequelize.STRING,
  icao: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  altitude: Sequelize.INTEGER,
  timezone: Sequelize.STRING,
});

Airports.sync();

exports.Airports = Airports;