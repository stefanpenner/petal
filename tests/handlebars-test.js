var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - handlebars', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/handlebars/handlebars.amd.js');
    var m = new Petal('bower_components/handlebars/handlebars.amd.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    expect(m.exports).to.deep.equal({
      'handlebars/safe-string': [ 'default' ],
      'handlebars/utils': [
        'extend',
        'toString',
        'isFunction',
        'isArray',
        'escapeExpression',
        'isEmpty'
      ],
      'handlebars/exception': [ 'default' ],
      'handlebars/base': [
        'VERSION',
        'COMPILER_REVISION',
        'REVISION_CHANGES',
        'HandlebarsEnvironment',
        'logger',
        'log',
        'createFrame'
      ],
      'handlebars/runtime': [
        'checkRevision',
        'template',
        'programWithDepth',
        'program',
        'invokePartial',
        'noop'
      ],
      'handlebars.runtime':           [ 'default' ],
      'handlebars/compiler/ast':      [ 'default' ],
      'handlebars/compiler/parser':   [ 'default' ],
      'handlebars/compiler/base':     [ 'parser', 'parse' ],
      'handlebars/compiler/compiler': [ 'Compiler', 'precompile', 'compile'
      ],
      'handlebars/compiler/javascript-compiler': [ 'default' ],
      'handlebars': [ 'default' ]
    });

    expect(m.imports).to.deep.equal({
      'handlebars/safe-string': [ 'exports' ],
      'handlebars/utils':       [ './safe-string', 'exports' ],
      'handlebars/exception':   [ 'exports' ],
      'handlebars/base':        [ './utils', './exception', 'exports' ],
      'handlebars/runtime':     [ './utils', './exception', './base', 'exports' ],
      'handlebars.runtime':
       [ './handlebars/base',
         './handlebars/safe-string',
         './handlebars/exception',
         './handlebars/utils',
         './handlebars/runtime',
         'exports' ],
      'handlebars/compiler/ast':      [ '../exception', 'exports' ],
      'handlebars/compiler/parser':   [ 'exports' ],
      'handlebars/compiler/base':     [ './parser', './ast', 'exports' ],
      'handlebars/compiler/compiler': [ '../exception', 'exports' ],
      'handlebars/compiler/javascript-compiler': [ '../base', '../exception', 'exports' ],
      'handlebars': [
        './handlebars.runtime',
        './handlebars/compiler/ast',
        './handlebars/compiler/base',
        './handlebars/compiler/compiler',
        './handlebars/compiler/javascript-compiler',
        'exports'
      ]
    });
  })
});
