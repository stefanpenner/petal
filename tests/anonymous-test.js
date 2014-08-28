var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');
var expect = require('chai').expect;

describe('Leaf - annonmous', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous.js');
    var m = new Leaf('./tests/fixtures/anonymous.js', source);

    assert(m.hasDefine, true, 'module has define property');
    assert.equal(m.isAnonymous, true, 'module is not named');

    m.remap('foobarbaz');

    astEquality(escodegen.generate(m.ast), fs.readFileSync('./tests/fixtures/was-anonymous.js'));
  });
});
