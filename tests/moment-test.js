var Leaf = require('../index.js');
var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

describe('Leaf - moment', function() {
  it('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/moment/moment.js');
    var m = new Leaf('bower_components/moment/moment.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, {
      'moment': []
    });

    assert.deepEqual(m.exports, {
      'moment': ['default']
    });
  });

  xit('has correct import/exports', function() {
    var source = fs.readFileSync('bower_components/moment/moment.js');
    var m = new Leaf('bower_components/moment/moment.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');
    assert.deepEqual(m.imports, {
      'moment': []
    });

    assert.deepEqual(m.exports, {
      'moment': [
        'default',
        'utc',
        'unix',
        'duration',
        'version',
        'defaultFormat',
        'momentProperties',
        'updateOffset',
        'lang',
        'langData',
        'isMoment',
        'isDuration',
        'normalizeUnits',
        'invalid',
        'parseZone',
        'parseTwoDigitYear',
        'fn'
      ]
    });
  });

  xit('works with minified version', function() {
    var source = fs.readFileSync('bower_components/moment/min/moment.min.js');
    var m = new Leaf('bower_components/moment/min/moment.js', source);

    assert(m.hasDefine(), 'no module is defined');
    assert.equal(m.isAnonymous, false, 'module is anonymous');

    expect(m.imports).to.deep.equal({
      'moment': []
    });

    expect(m.exports).to.deep.equal({
      'moment': [
        'default',
        'utc',
        'unix',
        'duration',
        'version',
        'defaultFormat',
        'momentProperties',
        'updateOffset',
        'lang',
        'langData',
        'isMoment',
        'isDuration',
        'normalizeUnits',
        'invalid',
        'parseZone',
        'parseTwoDigitYear',
        'fn'
      ]
    });
  });
});
