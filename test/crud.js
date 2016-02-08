var assert = require('assert'),
  dc = require('../bluemix_datacache.js');
  
describe('crud tests', function() {

  // add a key
  it('add a key', function(done) {
    dc.put("testkey", { "str":"testvalue" }, function(err, data) {
      assert.equal(err, null);
      assert.equal(typeof data, "string");
      done();
    });
  });
  
  // get a key
  it('get a key', function(done) {
    dc.get("testkey", function(err, data) {
      assert.equal(err, null);
      assert.equal(typeof data, "object");
      assert.equal(data.str, "testvalue");
      done();
    });
  });

  // remove a key
  it('remove a key', function(done) {
    dc.remove("testkey", function(err, data) {
      assert.equal(err, null);
      done();
    });
  });
  
  // get a key
  it('get a key should now fail', function(done) {
    dc.get("testkey", function(err, data) {
      assert.equal(err, null);
      assert.equal(data, null);
      done();
    });
  });


});