var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - ember/load-initializers', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/ember-load-initializers/ember-load-initializers.js');
    var m = new Petal('bower_components/ember-load-initializers/ember-load-initializers.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    expect(m.imports).to.deep.equal({
      'ember/load-initializers': []
    });

    expect(m.exports).to.deep.equal({
      'ember/load-initializers': ['default']
    });
  });
});
