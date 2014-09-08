
// parse BlueMix  configuration from environment variables, if present
var services = process.env.VCAP_SERVICES,
 request = require('request'),
 credentials = null;
 
// load BlueMix credentials from session
if(typeof services != 'undefined') {
  services = JSON.parse(services);
  credentials = services['DataCache-1.0'][0].credentials;
} 

// formulate the options object to be passed to request
var getOptions = function(method, key, value) {
  var options = {
    uri: credentials.restResource + "/" + credentials.gridName + "/" + encodeURIComponent(key),
    method: method,
    auth: {
      user: credentials.username,
      pass: credentials.password
    },
    json: (typeof value == 'object')?value:true
  };
  return options;
}

// put a new key/value pair in cache. 'value' is a JS object
var put = function(key, value, callback) {
  if(credentials == null) {
    return callback(true,null);
  }
  request(getOptions('POST', key, value), function(err, req, body) {
    callback(err, body);
  });
};

var get = function(key, callback) {
  if(credentials == null) {
    return callback(true,null);
  }
  request(getOptions('GET', key), function(err, req, body) {
    callback(err, JSON.parse(body));
  });
};

var remove = function(key, callback) {
  if(credentials == null) {
    return callback(true,null);
  }
  request(getOptions('DELETE', key), function(err, req, body) {
    callback(err, body);
  });
};

/*put("test",{a:1,b:"bob",c:true}, function(err,data) {
  console.log("POST",err,data);
  get("test", function(err, data) {
    console.log("GET",err,data);
    remove("test", function(err, data) {
      console.log("REMOVE",err,data);
    })
  })
});
*/
 
module.exports =  {
  get: get,
  put: put,
  remove: remove
};


