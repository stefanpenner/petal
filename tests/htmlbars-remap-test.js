var Petal = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Petal - htmlbars remap:', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('vendor/htmlbars-runtime.amd.js');
    var m = new Petal('vendor/htmlbars-runtime.amd.js', source);
    var remappedPetal;

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    remappedPetal = m.remap('htmlbars-runtime@2.0.0');

    expect(remappedPetal.exports).to.deep.equal({
      'htmlbars-runtime@2.0.0': [
        'domHelpers',
        'Morph'
      ],
      'htmlbars-runtime@2.0.0/dom_helpers': [
        'domHelpers'
      ],
      'htmlbars-runtime@2.0.0/hooks': [
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
      'htmlbars-runtime@2.0.0/utils': [
        'merge'
      ]
    });

    expect(remappedPetal.imports).to.deep.equal({
      'htmlbars-runtime@2.0.0': [
        'htmlbars-runtime@2.0.0/dom_helpers',
        'morph',
        'exports'
      ],
      'htmlbars-runtime@2.0.0/dom_helpers': [
        'htmlbars-runtime@2.0.0/utils',
        'exports'
      ],
      'htmlbars-runtime@2.0.0/hooks': [
        'htmlbars-runtime@2.0.0/utils',
        'handlebars/safe-string',
        'exports'
      ],
      'htmlbars-runtime@2.0.0/utils': [
        'exports'
      ]
    });
  })
});
