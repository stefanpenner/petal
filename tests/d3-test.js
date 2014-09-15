var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');

describe('Petal - d3', function() {
  it('includes an anonymous module', function() {
    var source = fs.readFileSync('bower_components/d3/d3.js');
    var m = new Petal('bower_components/d3/d3.js', source);

    assert(m.hasDefine(), 'module has define property');
    assert.equal(m.isAnonymous, true, 'module is not named');
  });
});
