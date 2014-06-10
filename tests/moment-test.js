var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');

describe('Leaf - moment', function() {
  it("has correct import/exports", function() {
    var source = fs.readFileSync("bower_components/moment/moment.js");
    var m = new Leaf("bower_components/moment/moment.js", source);

    assert(m.hasDefine, true, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, []);
    assert.deepEqual(m.exports, ['default']);

    assert.equal(m.name, 'moment');
  });

  it("works with minified version", function() {
    var source = fs.readFileSync("bower_components/moment/min/moment.min.js");
    var m = new Leaf("bower_components/moment/min/moment.js", source);

    assert(m.hasDefine, true, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, []);
    assert.deepEqual(m.exports, ['default']);

    assert.equal(m.name, 'moment');
  });
});
