var traverse = require('es-simpler-traverser');
var exportsFromSingleExport = require('./exports-from-single-export');

module.exports = function exportsFromInput(exportsName, moduleName, body) {
  var exports = [ ];
  traverse(body, {
    enter: function(node) {
      if (node.type === 'AssignmentExpression' &&
          node.left.type === 'MemberExpression') {
        if (isPropertyOfExports(node.left, exportsName) ||
            isPropertyOfExportsPropertyOfModule(node.left, moduleName)) {
          exports.push(propertyName(node.left));
        } else if (isExportsPropertyOfModule(node.left, moduleName)) {
          exports.push.apply(exports, exportsFromSingleExport(node.right));
        }
      }
    }
  });

 return exports;
};

function propertyName(memberExpression) {
  var property = memberExpression.property;
  switch (property.type) {
    case 'Literal':
      return property.value;
    case 'Identifier':
      return property.name;
    default:
      throw new Error('unsupported MemberExpression property.type: ' + property.type);
  }
}

/*
{
  "type": "MemberExpression",
  "computed": false,
  "object": {
    "type": "Identifier",
    "name": "module"
  },
  "property": {
    "type": "Identifier",
    "name": "exports"
  }
}
*/
function isExportsPropertyOfModule(memberExpression, moduleName) {
  if (!moduleName) return;
  return memberExpression.object.type === 'Identifier' &&
         memberExpression.object.name === moduleName &&
         propertyName(memberExpression) === 'exports';
}

/*
{
  "type": "MemberExpression",
  "computed": false,
  "object": {
    "type": "Identifier",
    "name": "exports"
  },
  "property": {
    "type": "Identifier",
    "name": "foo"
  }
}
*/
function isPropertyOfExports(memberExpression, exportsName) {
  if (!exportsName) return;
  return memberExpression.object.type === 'Identifier' &&
         memberExpression.object.name === exportsName;
}

/*
{
  "type": "MemberExpression",
  "computed": false,
  "object": {
    "type": "MemberExpression",
    "computed": false,
    "object": {
      "type": "Identifier",
      "name": "module"
    },
    "property": {
      "type": "Identifier",
      "name": "exports"
    }
  },
  "property": {
    "type": "Identifier",
    "name": "foo"
  }
}
*/
function isPropertyOfExportsPropertyOfModule(memberExpression, moduleName) {
  if (!moduleName) return;
  return memberExpression.object.type === 'MemberExpression' &&
         memberExpression.object.object.type === 'Identifier' &&
         memberExpression.object.object.name === moduleName &&
         propertyName(memberExpression.object.property) === 'exports';
}
