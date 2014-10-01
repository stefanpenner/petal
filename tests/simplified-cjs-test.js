var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');
var expect = require('chai').expect;

describe('Petal - AMD simplified CJS', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/simplified-cjs.js');
    var m = new Petal('./tests/fixtures/simplified-cjs.js', source);

    assert(m.hasDefine(), 'expected module to have a define');
    assert(m.isAnonymous, 'expected module to not be named');


    expect(m.imports).to.deep.equal({
      '.': ['require', 'exports', 'module']
    });

    expect(m.exports).to.deep.equal({
      '.': ['default']
    });

    var remapped = m.remap('foobarbaz');

    assert(!remapped.isAnonymous, 'expected module to be named');
    expect(remapped.exports).to.deep.equal({
      'foobarbaz': [
        'default'
      ]
    });

    astEquality(escodegen.generate(remapped.ast), fs.readFileSync('./tests/fixtures/was-simplified-cjs.js'));
  });
});
