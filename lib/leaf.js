module.exports = Leaf;

var HAS_DEFINE = /define\(/;

var esprima = require('esprima');
var Scope = require('./scope');
var hasReturn = require('./helpers/has-return');
var exportsFromInput = require('./helpers/exports-from-input');
var exportsFromReturn = require('./helpers/exports-from-return');
var traverse = require('./traverse');

function Leaf(path, source, ast) {
  this.path = path;
  this.source = source;
  this.ast = ast;
  this.isAnonymous = undefined;
  this.imports = [];
  this.exports = [];
  this.scope = new Scope();

  if (this.hasDefine()) {
    this._ast();
    this._walk();
  }
}

module.exports = Leaf;

Leaf.prototype.hasDefine = function() {
  return HAS_DEFINE.test(this.source);
};

Leaf.prototype._ast  = function() {
  this.ast = esprima.parse(this.source);
};

Leaf.prototype._walk  = function() {
  var scope = this.scope;

  traverse(this.ast, {
    exit: function(node) {
      if (node.type === 'FunctionExpression') {
        scope.pop();
      }
    },

    enter: function(node) {
      if (node.type === 'VariableDeclarator' && node.id.name === 'define') {
        scope.set('define', true);
      }

      if (node.type === 'FunctionExpression') {
        scope.push();
      } else if (node.type === 'CallExpression' && node.callee.name === 'define') {
        var args = node.arguments;
        var body;

        if (scope.has('define')) {
          return;
        }

        switch (args.length)
        {
          case 1:
            var arg = args[0];
             var type = arg.type;

          if (type === 'FunctionExpression') {
            body = arg.body.body;
            this.isAnonymous = true;
          } else{
            throw new Error('Unkown define declaration type: ' + type);
          }
          break;
          case 2:
            var firstArg = args[0];
            body = args[1].body.body;

          if (firstArg.type === 'ArrayExpression') {

            this.imports = firstArg.elements.map(function(entry) {
              return entry.value;
            });

            this.isAnonymous = true;
          } else {
            // is this valid?...
            this.name = firstArg.value;
            this.imports = [ ];
            this.isAnonymous = false;
          }
          break;
          case 3:
            body = args[2].body.body;

          this.name = args[0].value;
          this.imports = args[1].elements;
          this.isAnonymous = false;
          break;
          default:
            throw new Error('two many arguments for define statement');
        }

        var returnStatement = hasReturn(body);
        var returnArgument;
        var inputName = '__exports__';

        if (returnStatement) {
          this.exports = exportsFromReturn(returnStatement);
        } else {
          this.exports = exportsFromInput(inputName, body);
        }

        return false; // stop walking
      }
    }.bind(this)
  });
};

Leaf.prototype.deanonymize = function(name) {
// look for: if (typeof define === 'function' && define.amd) {
  // name this one
  // or name the define
};


