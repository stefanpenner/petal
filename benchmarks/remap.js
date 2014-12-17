// node ./benchmarks/imports-exports.js tests/fixtures/*

var fs = require('fs');
var Petal = require('../');

var files = process.argv.slice(2, process.argv.length);

var benchmarks = files.map(function(path) {
  var file = fs.readFileSync(path).toString();
  return {
    name: path,
    fn: function() {
      var petal = new Petal(path, file);
      
      return petal.remap('some-other-module-name');
    }
  };
});

require('./bench')(benchmarks);
