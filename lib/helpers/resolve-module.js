module.exports = function resolveModule ( child, name ) {
  if (child.charAt(0) !== '.') { return child; }
  var parts = child.split('/');
  var nameParts = name.split('/');
  var parentBase = nameParts.length > 1 ? nameParts.slice(0, -1) : [ nameParts[ 0 ] ];

  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];

    if (part === '..') { parentBase.pop(); }
    else if (part === '.') { continue; }
    else { parentBase.push(part); }
  }

  return parentBase.join('/');
}
