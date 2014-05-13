function getDiffFromUrl(url, callback) {
  var req = require('request');
  req(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      getParsedDiff(body, callback);
    } else {
      throw('COULD NOT FETCH DIFF FROM URL');
    }
  })
}

function getDiffFromFile(filename, callback) {
  var fs = require('fs');
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    getParsedDiff(data, callback);
  });
}


function getParsedDiff(diff, callback) {
  /*
  Eats: A git diff
  Poops: An array of objects like so:
    [
      {
        a: 'file-a.js';
        b: 'file-b.js';
        additions: ['line1', 'line2'];
        deletions: ['line1', 'line2'];
        fileExtension: 'js'
      }

    ]
  */
  if (!diff) { throw 'No git diff to parse';}
  if (diff.match(/^diff/) === -1) { throw 'Invalid file: Not a complete git diff';}
  rows = splitLines(diff);
  parsed = [];
  curr = {additions: [], deletions: []};

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].match(/^diff/)) {
      if (i > 0) {
        parsed.push(curr);
        curr = {};
      }
      curr.fileExtension = rows[i].match(/\.(.+?)\s/)[1];
    }
    else if (rows[i].trim().match(/^\-\-\-/)) {
      curr.a = rows[i].trim().replace('\-\-\- a/', '');
    }
    else if (rows[i].trim().match(/^\+\+\+/)) {
      curr.b = rows[i].trim().replace('\+\+\+ b/', '');
    }
    else if (rows[i].trim().match(/^\-/)) {
      var deletion = rows[i].trim().replace('-', '');
      if (deletion) {
        curr.deletions.push(deletion);
      }
    }
    else if (rows[i].trim().match(/^\+/)) {
      var addition = rows[i].trim().replace('+', '');
      if (addition) {
        curr.additions.push(addition);
      }
    }
  }
  parsed.push(curr);
  if (callback && typeof callback == 'function') {
    callback(parsed);
  }
}

function parseDiff(options, callback) {
  if (options.url) {
    getDiffFromUrl(options.url, callback);
  } else if (options.fileName) {
    getDiffFromFile(options.fileName, callback);
  }
}

function splitLines(text) {
  return text.match(/^.*([\n\r]+|$)/gm);
}

parseDiff({fileName: 'test.diff'}, function(diff) {console.log('file callback: ', diff)});
parseDiff({url: 'https://github.com/brooklynjs/brooklynjs.github.io/pull/56.diff'}, function(diff) {console.log('url callback: ', diff)});
