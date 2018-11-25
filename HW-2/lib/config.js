/*
 * Create and export configuration variables
 *
 */

//Container for all the environments
const environments  = {};

//Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid': 'AC905682de8411e5b8802d6e607f5b1298',
    'authToken' : '9a1ecad2de2fe145fa879066d4d2c101',
    'fromPhone' : '+48732168726'
  }
};

//Production environment
environments.production = {
  'port' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashSecret' : 'thisIsAlsoASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid': 'AC905682de8411e5b8802d6e607f5b1298',
    'authToken' : '9a1ecad2de2fe145fa879066d4d2c101',
    'fromPhone' : '+48732168726'
  }
};

//Determine which evironment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the enviornments above, if not, default to staging
const environmetToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmetToExport;