
module.exports = ImportDeclaration;

function ImportDeclaration(scope, leaf) {
  this.scope = scope;
  this.leaf = leaf;
}

ImportDeclaration.prototype.enter = function(node) {
  var source = node.source.value;
  var imports = this.leaf.imports[source] || [];
  this.leaf.imports[source] = imports;
  imports.push(node.kind);

  return false;
};