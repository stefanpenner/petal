var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - own loader', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("tests/fixtures/own-loader.js");
    var m = new Leaf("tests/fixtures/own-loader.js", source);

    assert(m.hasDefine, false, 'no module is defined');
    assert.equal(m.isAnonymous, undefined, 'module is anonymous');
    assert.deepEqual(m.imports, []);
    assert.deepEqual(m.exports, []);

    assert.equal(m.name, undefined);
  });
});
