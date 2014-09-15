
module.exports = ExportDeclaration;

function ExportDeclaration(scope, petal) {
  this.scope = scope;
  this.petal = petal;
}

ExportDeclaration.prototype.enter = function(node) {
  var source = '.';
  var exports = this.petal.exports[source] || [];
  this.petal.exports[source] = exports;

  var name = node.default ? 'default' : node.declaration.id.name;
  exports.push(name);

  return false;
};
