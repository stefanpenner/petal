module.exports = function hasReturn(block) {
  var statement;
  if (block) {
    for (var i = 0; i < block.length; i++) {
      statement = block[i];
      if (statement.type === 'ReturnStatement') {
        return statement;
      }
    }
  }

  return false;
};
