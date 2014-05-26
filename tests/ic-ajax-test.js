var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - ic-ajax', function() {
  it("has correct imports/exports", function() {
    var source = fs.readFileSync("bower_components/ic-ajax/dist/amd/main.js");
    var m = new Leaf("bower_components/ic-ajax/dist/amd/main.js", source);

    assert(m.hasDefine, true, 'module has define property');
    assert.equal(m.isAnonymous, true, 'module is named');
    assert.deepEqual(m.imports, [
      'ember',
      'exports'
    ], 'has correct imports');

    assert.deepEqual(m.exports.sort(), [
      '__fixtures__',
      'default',
      'defineFixture',
      'lookupFixture',
      'raw',
      'request'
    ].sort());
  });
});
