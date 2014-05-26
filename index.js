var esprima = require('esprima');
var HAS_DEFINE = /define\(/;

function Scope() {
  this.__context__ = Object.create(null);
  this.__stack__ = [this.__context__];
}

Scope.prototype.has = function(key) {
  return key in this.__context__;
};

Scope.prototype.set = function(key, value) {
  return (this.__context__[key] = value);
};

Scope.prototype.get = function(key, value) {
  return this.__context__[key];
};

Scope.prototype.push = function() {
  this.__context__ = Object.create(this.__context__);
  this.__stack__.push(this.__context__);
};

Scope.prototype.pop = function() {
  this.__context__ = this.__stack__.pop();
};

/*
 *
 * {
 *  object: {
 *    a: 1,
 *    b: 2,
 *    c: 3
 *    d: {
 *      a: 1,
 *      b: 2,
 *      c: 3,
 *      d: 4
 *    }
 *   }
 * }
 */

function traverse(node, visitor) {
  var key, child, children;

  if (node && typeof node === 'object') {
    if (typeof visitor.enter === 'function') {
      visitor.enter(node);
    }

    children = Object.keys(node);

    for (var i = 0; i < children.length; i++) {
      key = children[i];
      child = node[key];

      traverse(child, visitor);
    }

    if (typeof visitor.exit === 'function') {
      visitor.exit(node);
    }
  }
}

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

// define(function() { });
// define('jquery', function() { });
// define('jquery', [ ], function() { });
function hasReturn(block) {
  var statement;
  if (block) {
    for (var i = 0; i < block.length; i++) {
      statement = block[i];
      if (statement.type === 'ReturnStatement') {
        return statement;
      }
    }
  }

  return false;
}

function variableDefinitionFor(name, node) {
  for (var i =0; i < node.declarations.length; i++) {
    var declaration = node.declarations[i];

    if (declaration.id.name === name) {
      return declaration;
    }
  }
}

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

function exportsFromReturn(returnStatement) {
  returnArgument = returnStatement.argument;

  if (returnArgument.type === 'Identifier') {
    return ['default'];
  } else if (returnArgument.type === 'ObjectExpression') {
    return returnArgument.properties.map(function(property) {
      return property.key.value;
    });
  } else {
    throw new Error("Unknown module return argument: "  + returnArgument.type);
  }
}

function exportsFromInput(inputName, body) {
  var exports = [ ];
  traverse(body, {
    enter: function(node) {
      if (node.type === 'AssignmentExpression' &&
          node.left.type === 'MemberExpression' &&
            node.left.object.name === inputName) {

        var property = node.left.property;

        switch (property.type) {
          case 'Literal':
            exports.push(property.value);
          break;
          case 'Identifier':
            exports.push(property.name);
          break;
          default:
            throw new Error('unknown export expression type: ' + property);
        }
      }
    }
  });

 return exports;
}
