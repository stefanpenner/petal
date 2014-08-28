var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');

describe('Leaf - d3', function() {
  it('includes an anonymous module', function() {
    var source = fs.readFileSync('bower_components/d3/d3.js');
    var m = new Leaf('bower_components/d3/d3.js', source);

    assert(m.hasDefine, true, 'module has define property');
    assert.equal(m.isAnonymous, true, 'module is not named');
  });
});
