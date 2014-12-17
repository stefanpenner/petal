module.exports = ExportDeclaration;

function ExportDeclaration(scope, petal) {
  this.scope = scope;
  this.petal = petal;
}

ExportDeclaration.prototype.enter = function(node) {
  var source = '.';
  var exports = this.petal.exports[source] || [];
  this.petal.exports[source] = exports;

  if (node.default) {
    exports.push('default');
  } else if (node.declaration) {
    if (node.declaration.id) {
      exports.push(node.declaration.id.name);
    } else if (node.declaration.declarations) {
      exports.push.apply(exports, node.declaration.declarations.map(function(declaration){
        return declaration.id.name;
      }));
    }
  } else if (node.specifiers) {
    exports.push.apply(exports, node.specifiers.map(function(specifier) {
      return specifier.id.name;
    }));
  }

  return false;
};
