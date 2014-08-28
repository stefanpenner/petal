var hasReturn = require('../helpers/has-return');
var exportsFromInput = require('../helpers/exports-from-input');
var exportsFromReturn = require('../helpers/exports-from-return');

module.exports = DefineCallExpression;

function DefineCallExpression(scope, leaf) {
  this.scope = scope;
  this.leaf = leaf;
}

DefineCallExpression.prototype.enter = function(node) {
  if (node.callee.name === 'define') {
    var args = node.arguments;
    var body, callback, type, firstArg;
    var definedIdentifier = false;

    this.leaf.nodes.push(node);

    if (this.scope.has('define')) {
      return;
    }

    var imports = [];
    var name = '.';

    switch (args.length)
    {
      case 1:
        firstArg = args[0];
        type = firstArg.type;

        if (type === 'FunctionExpression') {
          body = firstArg.body.body;
          this.leaf.isAnonymous = true;
        } else if (type === 'Identifier') {
          definedIdentifier = true;
          this.leaf.isAnonymous = true;
        } else {
          throw new Error('Unkown define declaration type: ' + type);
        }
        break;
      case 2:
        firstArg = args[0];
        callback = args[1];
        body = callback.body.body;

        if (firstArg.type === 'ArrayExpression') {
          imports = firstArg.elements.map(function(entry) {
            return entry.value;
          });
          this.leaf.isAnonymous = true;
        } else {
          name = firstArg.value;
          this.leaf.isAnonymous = false;
        }

        break;
      case 3:
        firstArg = args[0];
        callback = args[2];

        body = callback.body.body;

        name = firstArg.value;
        imports = args[1].elements.map(function(element) {
          return element.value;
        });

        this.leaf.isAnonymous = false;
        break;

      default:
        throw new Error('two many arguments for define statement');
    }

    var returnStatement = hasReturn(body);
    var exportsIndex = imports.indexOf('exports');
    var exportsName;

    if (exportsIndex > -1) {
      exportsName = callback.params[exportsIndex].name;
    }

    var exports = [];

    if (returnStatement) {
      exports = exportsFromReturn(returnStatement);
    } else if (exportsName) {
      exports = exportsFromInput(exportsName, body);
    } else if (definedIdentifier) {
      exports = ['default'];
    } else {
      throw new Error("Module without exports... are you sure?");
    }

    this.leaf.imports[name] = imports;
    this.leaf.exports[name] = exports;

    this.leaf.name = name ? name : '.';

    return false; // stop walking
  }
};
