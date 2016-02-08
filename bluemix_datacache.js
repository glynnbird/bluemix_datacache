
// parse BlueMix  configuration from environment variables, if present
var services = process.env.VCAP_SERVICES,
 request = require('request'),
 debug = require('debug')('datacache'),
 credentials = null;
 
// load BlueMix credentials from session
if (typeof services != 'undefined') {
  services = JSON.parse(services);
  credentials = services['DataCache-1.0'][0].credentials;
  debug("Found datacache service on", credentials.restResourceSecure);
} else {
  throw("No 'DataCache-1.0' found in VCAP_SERVICES environment variable");
}

// formulate the options object to be passed to request
var getOptions = function(method, key, value) {
  var options = {
    uri: credentials.restResourceSecure + "/" + credentials.gridName + "/" + encodeURIComponent(key),
    method: method,
    auth: {
      user: credentials.username,
      pass: credentials.password
    },
    json: (typeof value == 'object')?value:false
  };
  debug(method, options);
  return options;
}

// put a new key/value pair in cache. 'value' is a JS object
var put = function(key, value, callback) {
  if (credentials == null) {
    return callback(true,null);
  }
  request(getOptions('POST', key, value), function(err, req, body) {
    callback(err, body);
  });
};

var get = function(key, callback) {
  if (credentials == null) {
    return callback(true,null);
  }
  request(getOptions('GET', key), function(err, req, body) {
    try {
      var retval = JSON.parse(body);
      callback(err, retval);
    } catch(e) {
      callback(err, null);
    }
  });
};

var remove = function(key, callback) {
  if (credentials == null) {
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


