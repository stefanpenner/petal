petal
====

[![Build Status](https://travis-ci.org/stefanpenner/leaf.svg)](https://travis-ci.org/stefanpenner/leaf)

library for inspecting and renaming various js module formats. This is still WIP, and should be considered pre-alpha

```js
var m = new Petal('vendor/htmlbars-runtime.amd.js', sourceOrAst);
m.hasDefine   // => true
m.isAnonymous // => true

m.exports === {
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

// now, lets remap the current module to another name
newM = m.remap('htmlbars-runtime@2.0.0');

newM.ast // => ast remapped regarldess of module format.

newM.exports === {
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
```
