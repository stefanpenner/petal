var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - handlebars', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("bower_components/handlebars/handlebars.amd.js");
    var m = new Leaf("bower_components/handlebars/handlebars.amd.js", source);

    assert(m.hasDefine, true, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, [], 'has no imports');
    assert.deepEqual(m.exports, [], 'has no exports');
  });
});
