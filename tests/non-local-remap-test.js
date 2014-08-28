var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - non local remap', function() {
  it('has non locals remapped', function() {
    var source = fs.readFileSync('vendor/htmlbars-runtime.amd.js');
    var m = new Leaf('vendor/htmlbars-runtime.amd.js', source);

    assert(m.hasDefine, true, 'module is defined');
    assert.equal(m.isAnonymous, false, 'module isnt anonymous');

    m.remap('htmlbars-runtime@2.0.0', {
      handlebars: 'handlebars@1.3.0',
      morph: 'morph@1.0.0'
    });

    expect(m.imports).to.deep.equal({
      'htmlbars-runtime@2.0.0': [
        'htmlbars-runtime@2.0.0/dom_helpers',
        'morph@1.0.0',
        'exports'
      ],
      'htmlbars-runtime@2.0.0/dom_helpers': [
        'htmlbars-runtime@2.0.0/utils',
        'exports'
      ],
      'htmlbars-runtime@2.0.0/hooks': [
        'htmlbars-runtime@2.0.0/utils',
        'handlebars@1.3.0/safe-string',
        'exports'
      ],
      'htmlbars-runtime@2.0.0/utils': [
        'exports'
      ]
    });

    assert.equal(m.name, 'htmlbars-runtime@2.0.0');
  });
});
