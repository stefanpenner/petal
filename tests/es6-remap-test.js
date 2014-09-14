var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - es6 remap', function() {
  it('throws an error on es6 remap', function() {
    var source = fs.readFileSync('./tests/fixtures/es6.js');
    var m = new Leaf('./tests/fixtures/es6.js', source);

    expect(es6Remap).to.throw(Error);

    function es6Remap() {
      m.remap('htmlbars-runtime@2.0.0');
    }

  });
});
