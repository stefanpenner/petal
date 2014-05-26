var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - ember/resolver', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("bower_components/ember-resolver/dist/ember-resolver.js");
    var m = new Leaf("bower_components/ember-resolver/dist/ember-resolver.js", source);

    assert(m.hasDefine, true, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, [], 'has no imports');
    assert.deepEqual(m.exports, ['default'], 'has no exports');
  });
});
