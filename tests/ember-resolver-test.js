var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - ember/resolver', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/ember-resolver/dist/ember-resolver.js');
    var m = new Petal('bower_components/ember-resolver/dist/ember-resolver.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    expect(m.imports).to.deep.equal({
      'ember/resolver': [],
      resolver: [ 'ember/resolver' ],
      'ember/container-debug-adapter': []
    });

    expect(m.exports).to.deep.equal({
      'ember/resolver': [ 'default' ],
      resolver: [ 'default' ],
      'ember/container-debug-adapter': [ 'default' ]
    });
  });
});
