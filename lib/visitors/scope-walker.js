module.exports = ScopeWalker;
function ScopeWalker(scope) {
  this.scope = scope;
}

ScopeWalker.prototype.enter = function(node) {
  this.scope.push();
};

ScopeWalker.prototype.exit = function(node) {
  this.scope.pop();
};


