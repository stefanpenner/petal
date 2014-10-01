module.exports = function exportsFromSingleExport(node) {
  var exports;

  switch (node.type) {
    case 'Identifier':
      exports = ['default'];
    break;
    case 'CallExpression':
      exports = ['default'];
    break;
    case 'FunctionExpression':
      exports = ['default'];
    break;
    case 'ObjectExpression':
      exports = node.properties.map(function(property) {
        return property.key.value;
      });
      if (exports.indexOf('default') === -1) {
        exports.push('default');
      }
    break;
    case  'SequenceExpression':
      var expressions = node.expressions;
      exports = identifySingleExport(expressions[expressions.length - 1]);
    break;
    default:
      throw new Error("Unsupported single module export node.type: "  + node.type);
  }

  return exports;
};
