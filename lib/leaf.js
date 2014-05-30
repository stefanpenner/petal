module.exports = Leaf;

var HAS_DEFINE = /define\(/;
var IS_RELATIVE = /^\.\//;

var esprima = require('esprima');
var Scope = require('./scope');
var traverse = require('es-simpler-traverser');

var ScopeWalker = require('./visitors/scope-walker');
var VariableDeclarator = require('./visitors/variable-declarator');
var DefineCallExpression = require('./visitors/define-call-expression');

module.exports = Leaf;

function Leaf(path, source, ast) {
  this.path = path;
  this.source = source;
  this.ast = ast;
  this.isAnonymous = undefined;
  this.imports = [];
  this.exports = [];
  this.scope = new Scope();
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

Leaf.prototype.hasDefine = function() {
  return HAS_DEFINE.test(this.source);
};

Leaf.prototype._ast  = function() {
  this.ast = esprima.parse(this.source);
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

Leaf.prototype.deanonymize = function(name) {
  var args = this._defineNode.arguments;
  var firstArg = args[0];

  if (firstArg.type === 'Literal' && (typeof firstArg.value === 'string')) {
    throw new Error('Module Already Named');
  }

  args.unshift({
    raw: "'" + name + "'",
    type: "Literal",
    value: name
  });

  var secondArg = args[1];
  if (secondArg.type === 'ArrayExpression') {
    // if the imports are relative, they must also be denomized
    this.imports = secondArg.elements.map(function(element) {
      element.value = element.value.replace(IS_RELATIVE, name + '/');
      return element.value;
    });
  }

  return this.ast;
};
