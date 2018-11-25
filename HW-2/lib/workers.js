/*
 *
 * Workers related tasks
 *
 */

//Dependencies
const fs = require('fs');
const path = require('path');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');

//Instantiate the worker object
const workers = {};

//Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
  //Get all the checks
  _data.list('checks', (err, checks) => {
    if(!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        //Read in the check data
        _data.read('checks', check, (err, originalCheckData) => {
          if(!err && originalCheckData) {

          } else {

          }
        });
      });
    } else {
      console.log('Error: Could not find any checks to process');
    }
  });
};

//Timer to execute the worker-process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60)
};


//Init script
workers.init = () => {
  //Execute all the checks immediately
  workers.gatherAllChecks();
  //Call the loop so the checks will execute letaer on
  workers.loop();
};

//Export the module
module.exports = workers;