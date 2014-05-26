var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - variable export var name', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("./tests/fixtures/exports-with-variable-name.js");
    var m = new Leaf("./tests/fixtures/exports-with-variable-export-name.js", source);

    assert(m.hasDefine, false, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, ['exports']);
    assert.deepEqual(m.exports, ['default']);

    assert.equal(m.name, 'foobarbaz');
  });
});
