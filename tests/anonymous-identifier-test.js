var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');
var expect = require('chai').expect;

describe('Leaf - annonmous with identifier', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous-identifier.js');
    var m = new Leaf('./tests/fixtures/anonymous-identifier.js', source);
    var remappedLeaf;

    assert(m.hasDefine(), 'expected module to have a define');
    assert(m.isAnonymous, 'expected module to not be named');

    expect(m.imports).to.deep.equal({
      '.': []
    });

    expect(m.exports).to.deep.equal({
      '.': ['default']
    });

    remappedLeaf = m.remap('foobarbaz');
    assert(!remappedLeaf.isAnonymous, 'expected module to be named');
    expect(remappedLeaf.imports).to.deep.equal({
      'foobarbaz': []
    });

    expect(remappedLeaf.exports).to.deep.equal({
      'foobarbaz': [ 'default' ]
    });

    astEquality(escodegen.generate(remappedLeaf.ast), fs.readFileSync('./tests/fixtures/was-anonymous-identifier.js'));
  });
});
