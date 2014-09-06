var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - ember-qunit', function() {
  it('has correct imports/exports', function() {
    var source = fs.readFileSync('bower_components/ember-qunit/dist/amd/main.js');
    var m = new Leaf('bower_components/ember-qunit/dist/amd/main.js', source);

    assert(m.hasDefine(), 'module has define property');
    assert(m.isAnonymous, 'module is anonymous');
    expect(m.imports).to.deep.equal({
      '.': [
        'ember',
        './isolated-container',
        './module-for',
        './module-for-component',
        './module-for-model',
        './test',
        './test-resolver',
        'exports'
      ]
    });

    expect(m.exports).to.deep.equal({
      '.': [
        'globalize',
        'moduleFor',
        'moduleForComponent',
        'moduleForModel',
        'test',
        'setResolver'
      ]
    });
  });
  it('remaps correctly', function() {
    var source = fs.readFileSync('bower_components/ember-qunit/dist/amd/main.js');
    var m = new Leaf('bower_components/ember-qunit/dist/amd/main.js', source);

    var remappedLeaf = m.remap('ember-qunit');

    expect(remappedLeaf.imports).to.deep.equal({
      'ember-qunit': [
        'ember',
        'ember-qunit/isolated-container',
        'ember-qunit/module-for',
        'ember-qunit/module-for-component',
        'ember-qunit/module-for-model',
        'ember-qunit/test',
        'ember-qunit/test-resolver',
        'exports'
      ]
    });


    expect(remappedLeaf.exports).to.deep.equal({
      'ember-qunit': [
        'globalize',
        'moduleFor',
        'moduleForComponent',
        'moduleForModel',
        'test',
        'setResolver'
      ]
    });
  });
});
