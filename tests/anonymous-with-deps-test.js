var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');
var expect = require('chai').expect;

describe('Leaf - anoymous', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous-with-deps.js');
    var m = new Leaf('./tests/fixtures/anonymous-with-deps.js', source);

    assert(m.hasDefine(), 'expected module to have a define');
    assert(m.isAnonymous, 'expected module to not be named');

    expect(m.imports).to.deep.equal({
      '.': [
        'ember',
        './isolated-container',
        './module-for',
        './module-for-component',
        './module-for-model',
        './test',
        './test-resolver',
        'exports'
      ]
    });

    var remapped = m.remap('foobarbaz');

    assert(!remapped.isAnonymous, 'expected module to be named');
    expect(remapped.imports).to.deep.equal({
      'foobarbaz': [
        'ember',
        'foobarbaz/isolated-container',
        'foobarbaz/module-for',
        'foobarbaz/module-for-component',
        'foobarbaz/module-for-model',
        'foobarbaz/test',
        'foobarbaz/test-resolver',
        'exports'
      ]
    });

    astEquality(escodegen.generate(remapped.ast), fs.readFileSync('./tests/fixtures/was-anonymous-with-deps.js'));
  });
});
