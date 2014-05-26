var esprima = require('esprima');

var HAS_DEFINE = /define\(/;

function traverse(object, visitor) {
  var key, child;

  if (visitor.call(null, object) === false) {
    return;
  }

  for (key in object) {
    if (object.hasOwnProperty(key)) {
      child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child, visitor);
      }
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
  this.leaves = [];

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
  for (var i = 0; i < block.length; i++) {
    statement = block[i];
    if (statement.type === 'ReturnStatement') {
      return statement;
    }
  }

  return false;
}

Leaf.prototype._walk  = function() {
  traverse(this.ast, function(node) {
    if (node.type === 'CallExpression' && node.callee.name === 'define') {
      var args = node.arguments;
      var body;

      switch ( args.length )
      {
        case 1:
          body = args[0].body.body;

        this.isAnonymous = true;
        break;
        case 2:
          body = args[1].body.body;
          var firstArg = args[0];

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
  }.bind(this));
};

Leaf.prototype.deanonymize = function(name) {

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
  traverse(body, function(node) {
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
 });

 return exports;
}
