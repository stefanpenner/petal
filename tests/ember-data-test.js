var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - ember-data (brings its own embeded loader)', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/ember-data/ember-data.js');
    var m = new Leaf('bower_components/ember-data/ember-data.js', source);

    assert(m.hasDefine(), 'module has define property');
    assert.equal(m.isAnonymous, undefined, 'module is anonymous');

    expect(m.imports).to.deep.equal({ });
    expect(m.exports).to.deep.equal({ });

    assert.equal(m.name, undefined);
  });
});
