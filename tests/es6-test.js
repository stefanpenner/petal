var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - es6', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('./tests/fixtures/es6.js');
    var m = new Petal('./tests/fixtures/es6.js', source);

    assert.equal(m.hasDefine(), false, 'module is not defined');
    assert.equal(m.isAnonymous, undefined, 'module is anonymous');

    expect(m.imports).to.deep.equal({bar: ['default'], foo: ['default', 'red', 'green', 'yellow']});
    expect(m.exports).to.deep.equal({'.': ['default', 'bar', 'pink', 'foo', 'baz']});

    assert.deepEqual(m.toJSON(), {
      "path":"./tests/fixtures/es6.js",
      "type":"ES6",
      "imports": {"bar": ["default"], "foo": ["default", "red", "green", "yellow"]},
      "exports": {".":   ["default", "bar", 'pink', 'foo', 'baz']}}
    );
  });
});
