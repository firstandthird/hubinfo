#!/usr/bin/env node

var fs = require('fs');

var template = process.argv[2];

fs.readFile(template, 'utf8', function(err, str) {
  if (err) throw err;

  var s = str.split('\n');
  for (var i = 0, c = s.length; i < c; i++) {
    s[i] = s[i].replace(/^\s+/, '');
  }
  var tmpl = "jQuery.fn.hubInfo.defaults.template = '" + s.join('') + "'";
  console.log(tmpl);
});

