var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - ic-ajax', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('bower_components/ic-ajax/dist/amd/main.js');
    var m = new Petal('bower_components/ic-ajax/dist/amd/main.js', source);

    assert(m.hasDefine(), 'module has define property');
    assert.equal(m.isAnonymous, true, 'module is named');
    expect(m.imports).to.deep.equal({
      '.': [
        'ember',
        'exports'
      ]
    });

    expect(m.exports).to.deep.equal({
      '.': [
        'request',
        'default',
        'raw',
        '__fixtures__',
        'defineFixture',
        'lookupFixture'
      ]
    });
  });
});
