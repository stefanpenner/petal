module.exports = function exportsFromReturn(returnStatement) {
  returnArgument = returnStatement.argument;

  if (returnArgument.type === 'Identifier') {
    return ['default'];
  } else if (returnArgument.type === 'ObjectExpression') {
    return returnArgument.properties.map(function(property) {
      return property.key.value;
    });
  } else {
    throw new Error("Unknown module return argument: "  + returnArgument.type);
  }
};
