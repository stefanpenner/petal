
module.exports = ImportDeclaration;

function ImportDeclaration(scope, petal) {
  this.scope = scope;
  this.petal = petal;
}

ImportDeclaration.prototype.enter = function(node) {
  var source = node.source.value;
  var imports = this.petal.imports[source] || [];
  this.petal.imports[source] = imports;
  imports.push(node.kind);

  return false;
};
