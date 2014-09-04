
// parse BlueMix  configuration from environment variables, if present
var services = process.env.VCAP_SERVICES,
 url = require('url'),
 http = require('http'),
 credentials = null;

// load BlueMix credentials from session
if(1 || typeof services != 'undefined') {
  services = JSON.parse(services);
  console.log(services);
  credentials = services['SessionCache-1.0'][0].credentials;
//  credentials = { restResource: "http://localhost:4000/a/b"} 
  credentials.parsed = url.parse(credentials.restResource);
  console.log(credentials);
}


var getHeaders = function() {
  var retval = {
      "Content-Type": "application/json",
      "Authorization": 'Basic ' + new Buffer(credentials.username + ':' + credentials.password).toString('base64')
    };
  return retval;
};

var put =  function(key, value, callback) {
  if(credentials == null) {
    return callback(true,null);
  }
  var options = {
    hostname: credentials.parsed.hostname,
    port: 80,
    path: credentials.parsed.pathname+ "/" + credentials.gridName + "/" + encodeURIComponent(key),
    method: 'POST',
    headers: getHeaders(),
    rejectUnauthorized: false,    
    agent: false
  };
  console.log("POST REQUEST",options);
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log("POST reply",chunk);
    });
    res.on('error',function(c) {
  	  console.log('post error: '+c);
    });
    res.on('end',function() {
        console.log('post status '+res.statusCode);
        callback(null,null);
    });
  });
  req.write(JSON.stringify(value));
  req.end();
};

var get = function(key, callback) {
  if(credentials == null) {
    return callback(true,null);
  }
  var options = {
    hostname: credentials.parsed.hostname,
    port: 80,
    path: credentials.parsed.pathname+ "/" + credentials.gridName + "/" + encodeURIComponent(key),
    method: 'GET',
    rejectUnauthorized: false,    
    agent: false
  };
  console.log("GET REQUEST",options);
  var req = http.request(options, function(res) {
    var result = "";
    res.on('data', function (chunk) {
      result += chunk;
    });
    res.on('error',function(c) {
  	  console.log('get error: '+c);
    });
    res.on('end',function() {
      if (res.statusCode == 200) {
        console.log("STATUS CODE 200!",result)
        callback(null, JSON.parse(result));        
      }
      else {
        callback(true, null); //error case        
      }
    });
  });
};

put("test",{a:1,b:"bob",c:true}, function(err,data) {
  console.log(err,data);
  get("test", function(err, data) {
    console.log(err,data);
  })
});
    /*
    
    // Function to get value in data cache using REST API
    get: function(key, callback) {
	  var get_options = {
	    hostname: this.parsed.hostname,
        port: '80',
	    path: this.parsed.pathname+'/'+this.wxs.gridName+ '/'+encodeURIComponent(key),
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': this.auth },
	    rejectUnauthorized: false,    
	    agent: false,
	  };
	  var get_req = http.request(get_options, function(res) {
          var resultString='';
	      res.on('data', function (chunk) {	      
              resultString+=chunk;
	      });
	      res.on('error',function(c) {
	    	  console.log('get error: '+error);
	      });
          res.on('end',function() {
              if (res.statusCode == 200)
                 callback(JSON.parse(resultString));
              else
                 callback(); //error case
          });
	  });
	  get_req.end();
   },
   
   // Function to remove value in data cache using REST API
   remove: function(key, callback) {
	  var remove_options = {
	    hostname: this.parsed.hostname,
	    path: this.parsed.pathname+'/'+this.wxs.gridName+ '/'+encodeURIComponent(key),
        port: '80',
	    method: 'DELETE',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': this.auth },
	    rejectUnauthorized: false,    
	    agent: false,
	  };
	  var remove_req = http.request(remove_options, function(res) {
          var resultString='';
	      res.on('data', function (chunk) {	      
              resultString+=chunk;
	      });
	      res.on('error',function(c) {
	    	  console.log('get error: '+error);
	      });
          res.on('end',function() {
              callback();
          });
	  });
	  remove_req.end();
   }
};
    */

//module.exports = WXS


