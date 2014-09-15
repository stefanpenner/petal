var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');
var expect = require('chai').expect;

describe('Petal - annonmous with identifier', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous-identifier.js');
    var m = new Petal('./tests/fixtures/anonymous-identifier.js', source);
    var remappedPetal;

    assert(m.hasDefine(), 'expected module to have a define');
    assert(m.isAnonymous, 'expected module to not be named');

    expect(m.imports).to.deep.equal({
      '.': []
    });

    expect(m.exports).to.deep.equal({
      '.': ['default']
    });

    remappedPetal = m.remap('foobarbaz');
    assert(!remappedPetal.isAnonymous, 'expected module to be named');
    expect(remappedPetal.imports).to.deep.equal({
      'foobarbaz': []
    });

    expect(remappedPetal.exports).to.deep.equal({
      'foobarbaz': [ 'default' ]
    });

    astEquality(escodegen.generate(remappedPetal.ast), fs.readFileSync('./tests/fixtures/was-anonymous-identifier.js'));
  });
});
