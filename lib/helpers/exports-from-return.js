var exportsFromSingleExport = require('./exports-from-single-export');
module.exports = function exportsFromReturn(returnStatement) {
  return exportsFromSingleExport(returnStatement.argument);
};
