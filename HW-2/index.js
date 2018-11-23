/*
 *
 * Primary file for API
 * 
 */

// Dependencies
const http = require('http');
const https = require('https')
const url = require('url');
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


// Instantiate the HTTP Server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

//Start the HTTP server 
httpServer.listen(config.httpPort, () => {
  
  console.log(`The server is listening on the port ${config.httpPort}`);
});

// Instantiate the HTTPS Server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

//Start the HTTPS Sserver 
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on the port ${config.httpsPort}`);
});

//All the server logic for both the http and https server
const unifiedServer = ((req, res) => {
  //Get the url and parse it
  const parsedUrl = url.parse(req.url, true)
  
  //Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  
  //Get the query string as an object
  const queryStringObject = parsedUrl.query;

  //Get the method
  const method = req.method.toLowerCase();

  //Get the headers as an object
  const headers = req.headers;

  let payload = '';
  req.on('data', data => {
    //Get the payload, if any
    payload = Buffer.from(data).toString();
    
  });

  req.on('end', () => {
    console.log(helpers.parseJsonToObject(payload).pass)
    //Choose the handler this request should go to, if one is not found choose the notFound handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      'payload' : helpers.parseJsonToObject(payload)
    };

    //Route the request to handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      //Use the status code called back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      //Use the payload called back by the handler or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      //Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      //Return the response
      res.writeHead(statusCode,{
        'Content-Type': 'application/json'
      });
      res.end(payloadString);

      //Log the payload
      console.log('Returning this response: ', statusCode, payloadString)
    });
  });
});



//Define a request router
const router = {
  'ping' : handlers.ping,
  'users' : handlers.users,
  'tokens' : handlers.tokens
}