different
=========

different is a node module for parsing git diff from a url or file.

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
different.parseDiff({url: 'https://github.com/jennazee/different/commit/6798084f3a41c626b07a62552ea4c78c4a2011d6.diff'}, function(diff) {console.log(diff)});

//diff from file
different.parseDiff({fileName: 'path/to/diff.diff'}, function(diff) {console.log(diff)});

```