var Leaf = require('../index.js');
var assert = require('assert');
var fs     = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');

describe('Leaf - annonmous', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous-call-expression.js');
    var m = new Leaf('./tests/fixtures/anonymous-call-expression.js', source);

    assert(m.hasDefine, 'expected module to have a define');
    assert(m.isAnonymous, 'expected module to not be named');

    assert.deepEqual(m.imports, []);
    var ast = m.deanonymize('foobarbaz');

    assert(!m.isAnonymous, 'expected module to be named');
    assert.deepEqual(m.imports, []);

    astEquality(escodegen.generate(m.ast), fs.readFileSync('./tests/fixtures/was-anonymous-call-expression.js'));
  });
});
