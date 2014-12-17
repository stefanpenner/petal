module.exports = ImportDeclaration;

function ImportDeclaration(scope, petal) {
  this.scope = scope;
  this.petal = petal;
}

ImportDeclaration.prototype.enter = function(node) {
  var source = node.source.value;
  var imports = this.petal.imports[source] || [];

  this.petal.imports[source] = imports;

  if (node.kind === 'default') {
    imports.push('default');
  } else if (node.specifiers) {
    imports.push.apply(imports, node.specifiers.map(function(specifier) {
      return specifier.id.name;
    }));
  } else {
    throw new TypeError("Unknown ImportDeclaration kind: " + node.kind);
  }

  return false;
};
