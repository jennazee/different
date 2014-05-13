different
=========

different is a node module for parsing git diff from a url or file into an array of JavaScript objects each representing changed files.

Installation
---

From NPM:

    npm install different

From GitHub:

    cd path/to/node_modules
    git clone git://github.com/jennazee/different.git
    cd different
    npm install .


Usage
---

```js
var different = require('different');

//diff from URL
different.parseDiff({url: 'https://github.com/jennazee/different/commit/6b7c205aa17e70f4958e8a7c20fccac8318480ff.diff'}, function(diff) {console.log(diff)});

//diff from file
different.parseDiff({fileName: 'path/to/diff.diff'}, function(diff) {console.log(diff)});

```

Example Array Output
---
```
[ {
    additions:
     [ 'Installation',
       '---',
       'From NPM:',
       'npm install different',
       'From GitHub:',
       'cd path/to/node_modules',
       'git clone git://github.com/jennazee/different.git',
       'cd different',
       'npm install .',
       'Usage',
       '---',
       '//diff from URL',
       '//diff from file',
       'different.parseDiff({fileName: \'path/to/diff.diff\'}, function(diff) {console.log(diff)});' ],
    deletions: [ 'How to use' ],
    fileExtension: 'md',
    a: '---------------',
    b: 'README.md'
  },
  {
    additions: [ '"version": "0.1.2",', '"main": "different.js",' ],
    deletions: [ '"version": "0.1.1",' ],
    fileExtension: 'json',
    a: 'package.json',
    b: 'package.json'
  }
]

```