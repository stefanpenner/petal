var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - handlebars remap:', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/handlebars/handlebars.amd.js');
    var m = new Leaf('bower_components/handlebars/handlebars.amd.js', source);

    assert(m.hasDefine, true, 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    m.remap('handlebars@2.0.0');

    // this version of handlebars is actually totally broken,
    // it exports invalid paths....
    expect(m.exports).to.deep.equal({
      'handlebars@2.0.0/safe-string': [ 'default' ],
      'handlebars@2.0.0/utils': [
        'extend',
        'toString',
        'isFunction',
        'isArray',
        'escapeExpression',
        'isEmpty'
      ],
      'handlebars@2.0.0/exception': [ 'default' ],
      'handlebars@2.0.0/base': [
        'VERSION',
        'COMPILER_REVISION',
        'REVISION_CHANGES',
        'HandlebarsEnvironment',
        'logger',
        'log',
        'createFrame'
      ],
      'handlebars@2.0.0/runtime': [
        'checkRevision',
        'template',
        'programWithDepth',
        'program',
        'invokePartial',
        'noop'
      ],
      'handlebars@2.0.0':                   [ 'default' ],
      'handlebars@2.0.0/compiler/ast':      [ 'default' ],
      'handlebars@2.0.0/compiler/parser':   [ 'default' ],
      'handlebars@2.0.0/compiler/base':     [ 'parser', 'parse' ],
      'handlebars@2.0.0/compiler/compiler': [ 'Compiler', 'precompile', 'compile' ],
      'handlebars@2.0.0/compiler/javascript-compiler': [ 'default' ]
    });

    expect(m.imports).to.deep.equal({
      'handlebars@2.0.0': [
        'handlebars@2.0.0/handlebars.runtime',
        'handlebars@2.0.0/handlebars/compiler/ast',
        'handlebars@2.0.0/handlebars/compiler/base',
        'handlebars@2.0.0/handlebars/compiler/compiler',
        'handlebars@2.0.0/handlebars/compiler/javascript-compiler',
        'exports'
      ],
      'handlebars@2.0.0/safe-string': [ 'exports' ],
      'handlebars@2.0.0/utils':       [ 'handlebars@2.0.0/safe-string', 'exports' ],
      'handlebars@2.0.0/exception':   [ 'exports' ],
      'handlebars@2.0.0/base': [
        'handlebars@2.0.0/utils',
        'handlebars@2.0.0/exception',
        'exports'
      ],
      'handlebars@2.0.0/runtime': [
        'handlebars@2.0.0/utils',
        'handlebars@2.0.0/exception',
        'handlebars@2.0.0/base',
        'exports'
      ],
      'handlebars@2.0.0/compiler/ast':    [ 'handlebars@2.0.0/exception', 'exports' ],
      'handlebars@2.0.0/compiler/parser': [ 'exports' ],
      'handlebars@2.0.0/compiler/base': [
        'handlebars@2.0.0/compiler/parser',
        'handlebars@2.0.0/compiler/ast',
        'exports'
      ],
      'handlebars@2.0.0/compiler/compiler': [
        'handlebars@2.0.0/exception',
        'exports'
      ],
      'handlebars@2.0.0/compiler/javascript-compiler': [
        'handlebars@2.0.0/base',
        'handlebars@2.0.0/exception',
        'exports'
      ]
    });
  })
});
