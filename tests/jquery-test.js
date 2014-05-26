var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - jquery', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("bower_components/jquery/dist/jquery.js");
    var m = new Leaf("bower_components/jquery/dist/jquery.js", source);

    assert(m.hasDefine, true, 'module has define property');
    assert.equal(m.isAnonymous, false, 'module is named');
    assert.deepEqual(m.imports, []);
    assert.deepEqual(m.exports, ['default']);
  });
});
