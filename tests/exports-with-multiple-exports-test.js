var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - variable export var name', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/multiple-property-exports.js');
    var m = new Leaf('./tests/fixtures/multiple-property-exports.js', source);

    assert(m.hasDefine(), false, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    expect(m.imports).to.deep.equal({
      'foobarbaz': ['exports']
    });

    expect(m.exports).to.deep.equal({
      'foobarbaz': [
        'default',
        'a',
        'b',
        'c'
      ]
    });
  });
});
