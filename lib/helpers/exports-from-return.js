function identifyReturnArgument(returnArgument) {
  var argument;

  switch (returnArgument.type) {
    case 'Identifier':
      argument = ['default'];
    break;
    case 'CallExpression':
      argument = ['default'];
    break;
    case 'FunctionExpression':
      argument = ['default'];
    break;
    case 'ObjectExpression':
      argument = returnArgument.properties.map(function(property) {
        return property.key.value;
      });
    break;
    case  'SequenceExpression':
      var expressions = returnArgument.expressions;
      argument = identifyReturnArgument(expressions[expressions.length - 1]);
    break;
    default:
      throw new Error("Unknown module return argument: "  + returnArgument.type);
  }

  return argument;
};

module.exports = function exportsFromReturn(returnStatement) {
  return identifyReturnArgument(returnStatement.argument);
};
