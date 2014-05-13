var fs = require('fs');
var req = require('request');

/* Exports */

var parseDiffFromUrl, parseDiffFromFile;

exports.parseDiff = function(options, callback) {
  if (options.url) {
    parseDiffFromUrl(options.url, callback);
  } else if (options.fileName) {
    parseDiffFromFile(options.fileName, callback);
  }
}

exports.parseDiffFromUrl = parseDiffFromUrl = function (url, callback) {
  req(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      getParsedDiff(body, callback);
    } else {
      throw('Could not get diff from URL');
    }
  })
}

exports.parseDiffFromFile = parseDiffFromFile = function (filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    getParsedDiff(data, callback);
  });
}


/* Internal functions */

function getParsedDiff(diff, callback) {
  if (!diff) { throw 'No git diff to parse';}
  if (diff.trim().search(/^diff/) !== 0) { throw 'Invalid file: Not a complete git diff';}
  var rows = splitLines(diff);
  var parsed = [];
  var curr = {additions: [], deletions: []};

  for (var i = 0; i < rows.length; i++) {
    //"diff" occurs at the beginning of a new file's diff so push to parsed and start a new object
    if (rows[i].match(/^diff/)) {
      if (i > 0) {
        parsed.push(curr);
        curr = {additions: [], deletions: []};
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
        curr.deletions.push(deletion.trim());
      }
    }
    else if (rows[i].trim().match(/^\+/)) {
      var addition = rows[i].trim().replace('+', '');
      if (addition) {
        curr.additions.push(addition.trim());
      }
    }
  }

  //must be done; push to parsed.
  parsed.push(curr);
  if (callback && typeof callback == 'function') {
    callback(parsed);
  }
}

function splitLines(text) {
  return text.match(/^.*([\n\r]+|$)/gm);
}
