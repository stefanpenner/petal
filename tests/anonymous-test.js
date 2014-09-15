var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var astEquality = require('esprima-ast-equality');
var escodegen = require('escodegen');
var expect = require('chai').expect;

describe('Petal - annonmous', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/anonymous.js');
    var m = new Petal('./tests/fixtures/anonymous.js', source);
    var remapped;

    assert(m.hasDefine(), 'module has define property');
    assert.equal(m.isAnonymous, true, 'module is not named');

    remapped = m.remap('foobarbaz');

    astEquality(escodegen.generate(remapped.ast), fs.readFileSync('./tests/fixtures/was-anonymous.js'));
  });
});
