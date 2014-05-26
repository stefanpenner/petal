var traverse = require('./traverse');

module.exports = function exportsFromInput(inputName, body) {
  var exports = [ ];
  traverse(body, {
    enter: function(node) {
      if (node.type === 'AssignmentExpression' &&
          node.left.type === 'MemberExpression' &&
            node.left.object.name === inputName) {

        var property = node.left.property;

        switch (property.type) {
          case 'Literal':
            exports.push(property.value);
          break;
          case 'Identifier':
            exports.push(property.name);
          break;
          default:
            throw new Error('unknown export expression type: ' + property);
        }
      }
    }
  });

 return exports;
};
