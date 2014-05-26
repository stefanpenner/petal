var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - ember/load-initializers', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("bower_components/ember-load-initializers/ember-load-initializers.js");
    var m = new Leaf("bower_components/ember-load-initializers/ember-load-initializers.js", source);

    assert(m.hasDefine, true, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, []);
    assert.deepEqual(m.exports, ['default']);

    assert.equal(m.name, "ember/load-initializers");
  });
});
