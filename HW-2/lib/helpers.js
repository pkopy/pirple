/*
 *
 * Helpers for various task
 * 
 */

//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

// Container for all the helpers
const helpers = {};

//Create a SHA256 hash
helpers.hash = (str) => {
  if(typeof(str) == 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

//Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
}

//Create a string of random alphanumeric characters, of given length
helpers.createRandomString = (strLength) => {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength) {
    //Define all the possible characters that could go into a string
    const possibleCharacters = 'abcdefghijklmonprqstuwvxyz0123456789';

    //Start the final string
    let str = '';
    for(i = 1; i <= strLength; i++) {
      //Get the random character form the possibleCharacters
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
      //Append this character to the final string
      str += randomCharacter;
    }

    //Return the final string
    return str
  } else {
    return false
  }

};

/*
//Send an SMS message via Twilio
helpers.sendTwilioSms = ((phone, msg, callback) => {
  //Validate the parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 9 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 160 ? msg.trim() : false;
  

  if(phone && msg) {
    //Configure the request payload
    const payload = {
      'from' : config.twilio.fromPhone,
      'to' : '+48' + phone,
      'body' : msg
    };
    //Stringify the payload
    const stringPayload = querystring.stringify(payload);
    
    //Configure the request details
    const requestDetails = {
      'from' : config.twilio.fromPhone,
      'to' : '+48' + phone,
      'body' : msg,
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
      'auth' : `${config.twilio.accountSid}:${config.twilio.authToken}`,
      'headers' : {
        'Content-Type' : 'application/x-www-from-urlencoded',
        'Contenet-Length' : Buffer.byteLength(stringPayload)
      }
    };

    //Instantiate the request object
    const req = https.request(requestDetails, (res) => {
      //Grab the ststus of the sent request
      const status = res.statusCode;
      // console.log(res)
      //Calbback successfully if the request went through
      if(status == 200 || status == 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`)
      }
    });

    //Bind to the error event so it does not get thrown
    req.on('error', (e) => {
      callback(e);
    });

    //Add the payload
    req.write(stringPayload);

    //End the request
    req.end();
  } else {
    callback('Given parameters were missing or invalid');
  }
});
*/

//Send an SMS message via Twilio
helpers.sendTwilioSms = ((phone, msg, callback) => {
  const accountSid = config.twilio.accountSid;
  const authToken = config.twilio.authToken;
  const client = require('twilio')(accountSid, authToken);

  client.messages
  .create({
     body: msg,
     from: config.twilio.fromPhone,
     to: `+48${phone}`
   })
  .then(callback(false))
  .done();
});

//Export the module
module.exports = helpers;