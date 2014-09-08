## bluemixdatacache

A simple Node.js library to interact with BlueMix's DataCache service.

It:

* parses the credentials found in BlueMix's environment variables
* exposes put/get/remove functions to add/fetch/remove key/value pairs

```
var bluemixdatacache = require('bluemixdatacache');

bluemixdatacache.put('mykey', {a:1, b:"two", c:true}, function(err, data) {
  bluemixdatacache.get('mykey', function(err, data) {
    console.log("Got", data);
  });
});
```


