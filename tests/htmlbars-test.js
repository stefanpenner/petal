var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - htmlbars', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('vendor/htmlbars-runtime.amd.js');
    var m = new Petal('vendor/htmlbars-runtime.amd.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    expect(m.exports).to.deep.equal({
      'htmlbars-runtime': [
        'domHelpers',
        'Morph'
      ],
      'htmlbars-runtime/dom_helpers': [
        'domHelpers'
      ],
      'htmlbars-runtime/hooks': [
        'content',
        'webComponent',
        'webComponentFallback',
        'element',
        'attribute',
        'concat',
        'subexpr',
        'lookupHelper',
        'simple',
        'hydrationHooks'
      ],
      'htmlbars-runtime/utils': [
        'merge'
      ]
    });

    expect(m.imports).to.deep.equal({
      'htmlbars-runtime': [
        './dom_helpers',
        'morph',
        'exports'
      ],
      'htmlbars-runtime/dom_helpers': [
        './utils',
        'exports'
      ],
      'htmlbars-runtime/hooks': [
        './utils',
        'handlebars/safe-string',
        'exports'
      ],
      'htmlbars-runtime/utils': [
        'exports'
      ]
    });
  })
});
