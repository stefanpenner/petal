var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');

describe('Leaf - annonmous', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous-with-deps.js');
    var m = new Leaf('./tests/fixtures/anonymous-with-deps.js', source);

    assert(m.hasDefine, 'expected module to have a define');
    assert(m.isAnonymous, 'expected module to not be named');

    assert.deepEqual(m.imports, [
      'ember',
      './isolated-container',
      './module-for',
      './module-for-component',
      './module-for-model',
      './test',
      './test-resolver',
      'exports'
    ]);

    var ast = m.deanonymize('foobarbaz');

    assert.deepEqual(m.imports, [
      'ember',
      'foobarbaz/isolated-container',
      'foobarbaz/module-for',
      'foobarbaz/module-for-component',
      'foobarbaz/module-for-model',
      'foobarbaz/test',
      'foobarbaz/test-resolver',
      'exports'
    ]);

    astEquality(escodegen.generate(m.ast), fs.readFileSync('./tests/fixtures/was-anonymous-with-deps.js'));
  });
});
