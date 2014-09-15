var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - jquery', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/jquery/dist/jquery.js');
    var m = new Petal('bower_components/jquery/dist/jquery.js', source);

    assert(m.hasDefine(), 'module has define property');
    assert.equal(m.isAnonymous, false, 'module is named');

    expect(m.imports).to.deep.equal({
      'jquery': []
    });

    expect(m.exports).to.deep.equal({
      'jquery': ['default']
    });
  });
});
