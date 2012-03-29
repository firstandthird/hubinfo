#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var templateDir = process.argv[2];
var outDir = process.argv[3];

var processTemplate = function(templateFile) {
  fs.readFile(templateFile, 'utf8', function(err, str) {
    if (err) throw err;

    var s = str.split('\n');
    for (var i = 0, c = s.length; i < c; i++) {
      s[i] = s[i].replace(/^\s+/, '');
    }
    var tmpl = "jQuery.fn.hubInfo.defaults.template = '" + s.join('') + "'";
    var basename = path.basename(templateFile);
    var outpath = path.join(outDir, basename).replace(/\.html$/, '.js');
    console.log('Generated '+ outpath);
    fs.writeFile(outpath, tmpl, function(err) {
      if (err) throw err;
    });
  });
};

console.log('Building Templates');
fs.readdir(templateDir, function(err, files) {
  if (err) throw err;
  files.forEach(function(file) {
    processTemplate(path.join(templateDir, file));
  });
});
