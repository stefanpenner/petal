
module.exports = ExportDeclaration;

function ExportDeclaration(scope, leaf) {
  this.scope = scope;
  this.leaf = leaf;
}

ExportDeclaration.prototype.enter = function(node) {
  var source = '.';
  var exports = this.leaf.exports[source] || [];
  this.leaf.exports[source] = exports;

  var name = node.default ? 'default' : node.declaration.id.name;
  exports.push(name);

  return false;
};