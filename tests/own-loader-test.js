var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - own loader', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('tests/fixtures/own-loader.js');
    var m = new Leaf('tests/fixtures/own-loader.js', source);

    assert(m.hasDefine, false, 'no module is defined');
    assert.equal(m.isAnonymous, undefined, 'module is anonymous');

    expect(m.imports).to.deep.equal({ });
    expect(m.exports).to.deep.equal({ });

    assert.equal(m.name, undefined);
  });
});
