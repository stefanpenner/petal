var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - ember (brings its own embeded loader)', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("bower_components/ember/ember.js");
    var m = new Leaf("bower_components/ember/ember.js", source);

    assert(m.hasDefine, false, 'no module is defined');
    assert.equal(m.isAnonymous, undefined, 'module is anonymous');
    assert.deepEqual(m.imports, []);
    assert.deepEqual(m.exports, []);
  });
});
