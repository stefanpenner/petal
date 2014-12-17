module.exports = VariableDeclarator;

function VariableDeclarator(scope) {
  this.scope = scope;
}

VariableDeclarator.prototype.enter = function(node) {
  this.scope.set(node.id.name, node);
};
