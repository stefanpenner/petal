module.exports = Leaf;

var HAS_DEFINE = /define\(/;
var IS_RELATIVE = /^\.\//;

var esprima = require('esprima');
var Scope = require('./scope');
var traverse = require('es-simpler-traverser');

var ScopeWalker = require('./visitors/scope-walker');
var VariableDeclarator = require('./visitors/variable-declarator');
var DefineCallExpression = require('./visitors/define-call-expression');
var cloneDeep = require('lodash-node/modern/objects/cloneDeep');
var path = require('path');
var resolveModule = require('./helpers/resolve-module');

module.exports = Leaf;

function Leaf(path, source, ast) {
  this.path = path;
  this.source = source;
  this.ast = ast;
  this.name = undefined;
  this.isAnonymous = undefined;
  this.imports = { };
  this.exports = { };
  this.nodes = [];
  this.scope = new Scope();
  this.type = undefined; // ['AST', 'AST-NAMED', 'ES6', 'CJS', 'GLOBAL', 'SYSTEM']

  this.visitors = {
    FunctionExpression: new ScopeWalker(this.scope),
    VariableDeclarator: new VariableDeclarator(this.scope),
    CallExpression: new DefineCallExpression(this.scope, this)
  };

  if (this.hasDefine()) {
    this._ast();
    this._walk();
  }
}

Leaf.prototype.clone = function() {
  var leaf = new Leaf(this.path, this.source, cloneDeep(this.ast));

  leaf.isAnonymous = this.isAnonymous
  leaf.imports = cloneDeep(this.imports);
  leaf.exports = cloneDeep(this.exports)
  leaf.scope   = cloneDeep(this.scope);
  leaf._walk(); // need to reparse

  return leaf;
};

Leaf.prototype.hasDefine = function() {
  return HAS_DEFINE.test(this.source);
};

Leaf.prototype._ast  = function() {
  this.ast = this.ast || esprima.parse(this.source);
};

Leaf.prototype._walk  = function() {
  var scope = this.scope;
  var visitors = this.visitors;

  traverse(this.ast, {
    exit: function(node) {
      var visitor = visitors[node.type];

      if (visitor && typeof visitor.exit === 'function') {
        visitor.exit(node);
      }
    },

    enter: function(node) {
      var visitor = visitors[node.type];

      if (visitor && typeof visitor.enter === 'function') {
        visitor.enter(node);
      }
    }
  });
};

// remap is currently destructive. It would be nice to actually have
// remap, clone and return a new leaf which is remapped
Leaf.prototype.remap = function(name, importRemap) {
  return this._remap(name, importRemap);
};

Leaf.prototype._remap = function(name, importRemap) {
  this.isAnonymous = (name === '.');

  var existingName    = this.name;
  var existingImports = this.imports;
  var existingExports = this.exports;

  importRemap = importRemap || {};

  this.imports = {};
  this.exports = {};

  this.name = name;

  this.nodes.forEach(function(node) {
    // TODO: make this work again, and sanely
    var args = node.arguments;
    var firstArg = args[0];
    var remaped = name;

    if (firstArg.type === 'Literal' && (typeof firstArg.value === 'string')) {
      // we need to resolve the relative names
      remaped = name + firstArg.value.replace(/^[^\/]+/,'');
      this.exports[remaped] = existingExports[firstArg.value];
    } else {
      args.unshift({
        raw: "'" + remaped + "'",
        type: "Literal",
        value: remaped
      });
      this.exports[remaped] = existingExports[existingName] || [];
    }

    var secondArg = args[1];
    if (secondArg && secondArg.type === 'ArrayExpression') {
      // we need to resolve the relative names
      this.imports[remaped] = secondArg.elements.map(function(element) {
        var depPieces, depName;
        element.value = resolveModule( element.value, remaped );
        element.value = element.value.replace(IS_RELATIVE, remaped + '/');
        
        depPieces = element.value.split('/');
        depName = depPieces[ 0 ];

        // Remap any any non-locals
        if ( importRemap[ depName ] ) {
          element.value = element.value.replace(depName, importRemap[ depName ] );
        }

        return element.value;
      });
    } else {
      this.imports[remaped] =  existingImports[existingName] || [];
    }

  }.bind(this));

  return this;
};
