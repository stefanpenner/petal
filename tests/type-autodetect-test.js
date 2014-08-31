var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var esprima = require('esprima');
var expect = require('chai').expect;

describe('Leaf - autodetect source type', function () {
  it( 'should detect AST', function () {
    var source = fs.readFileSync('./tests/fixtures/global.js');
    var ast = esprima.parse(source);
    var m = new Leaf('./tests/fixtures/global.js', source, ast);
    expect(m.type).to.equal('AST');
  });

  it( 'should detect AMD', function () {
    var source = fs.readFileSync('./tests/fixtures/anonymous-with-deps.js');
    var m = new Leaf('./tests/fixtures/anonymous-with-deps.js', source);
    expect(m.type).to.equal('AMD');
  });

  it( 'should detect CJS', function () {
    var source = fs.readFileSync('./tests/fixtures/cjs.js');
    var m = new Leaf('./tests/fixtures/cjs.js', source);
    expect(m.type).to.equal('CJS');
  });

  it( 'should detect ES6', function () {
    var source = fs.readFileSync('./tests/fixtures/es6.js');
    var m = new Leaf('./tests/fixtures/es6.js', source);
    expect(m.type).to.equal('ES6');
  });

  it( 'should detect SYSTEM', function () {
    var source = fs.readFileSync('./tests/fixtures/system.js');
    var m = new Leaf('./tests/fixtures/system.js', source);
    expect(m.type).to.equal('SYSTEM');
  });
  
  it( 'should detect GLOBAL', function () {
    var source = fs.readFileSync('./tests/fixtures/global.js');
    var m = new Leaf('./tests/fixtures/global.js', source);
    expect(m.type).to.equal('GLOBAL');
  });
});
