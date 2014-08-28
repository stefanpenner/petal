var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - qunit', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/qunit/qunit/qunit.js');
    var m = new Leaf('bower_components/qunit/qunit/qunit.js', source);

    assert(m.hasDefine, false, 'no module is defined');
    assert.equal(m.isAnonymous, undefined, 'module is anonymous');

    expect(m.imports).to.deep.equal({ });
    expect(m.exports).to.deep.equal({ });

    assert.equal(m.name, undefined);
  });
});
