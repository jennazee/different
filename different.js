var fs = require('fs');
var req = require('request');

/* Exports */

exports.parseDiff = function(options, callback) {
  if (options.url) {
    parseDiffFromUrl(options.url, callback);
  } else if (options.fileName) {
    parseDiffFromFile(options.fileName, callback);
  }
}

exports.parseDiffFromUrl = function parseDiffFromUrl(url, callback) {
  req(url, function (err, response, body) {
    if (err) {
      throw err;
    } else if (response.statusCode == 200) {
      getParsedDiff(body, callback);
    } else {
      throw Error('Could not get diff from URL');
    }
  })
}

exports.parseDiffFromFile = function parseDiffFromFile(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    getParsedDiff(data, callback);
  });
}


/* Internal functions */

function getParsedDiff(diff, callback) {
  if (!diff) { throw Error('No git diff to parse');}
  if (diff.trim().search(/^diff/) !== 0) { throw Error('Invalid file: Not a complete git diff');}
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
    else if (rows[i].trim().match(/^\-\-\-\sa\//)) {
      curr.a = rows[i].trim().replace('\-\-\- a/', '');
    }
    else if (rows[i].trim().match(/^\+\+\+\sb\//)) {
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
