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
    var body, callback;

    this.leaf._defineNode = node;

    if (this.scope.has('define')) {
      return;
    }

    switch (args.length)
    {
      case 1:
        callback = args[0];
        var arg = args[0];
        var type = arg.type;

        if (type === 'FunctionExpression') {
          body = arg.body.body;
          this.leaf.isAnonymous = true;
        } else{
          throw new Error('Unkown define declaration type: ' + type);
        }
        break;

      case 2:
        var firstArg = args[0];
        callback = args[1];
        body = callback.body.body;

        if (firstArg.type === 'ArrayExpression') {
          this.leaf.imports = firstArg.elements.map(function(entry) {
            return entry.value;
          });

          this.leaf.isAnonymous = true;
        } else {
          // is this valid?...
          this.leaf.name = firstArg.value;
          this.leaf.imports = [ ];
          this.leaf.isAnonymous = false;
        }

        break;

      case 3:
        callback = args[2];
        body = callback.body.body;

        this.leaf.name = args[0].value;
        this.leaf.imports = args[1].elements.map(function(element) {
          return element.value;
        });
        this.leaf.isAnonymous = false;
        break;

      default:
        throw new Error('two many arguments for define statement');
    }

    var returnStatement = hasReturn(body);
    var exportsIndex = this.leaf.imports.indexOf('exports');
    var exportsName;

    if (exportsIndex > -1) {
      exportsName = callback.params[exportsIndex].name;
    }

    if (returnStatement) {
      this.leaf.exports = exportsFromReturn(returnStatement);
    } else if (exportsName) {
      this.leaf.exports = exportsFromInput(exportsName, body);
    } else {
      throw new Error("Module without exports... are you sure?");
    }

    return false; // stop walking
  }
};
