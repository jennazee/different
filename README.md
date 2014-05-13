different
=========

different is a node module for parsing git diff from a url or file.


How to use
--------------

```js
var different = require('different');
different.parseDiff({url: 'https://github.com/jennazee/different/commit/6798084f3a41c626b07a62552ea4c78c4a2011d6.diff'}, function(diff) {console.log(diff)});

```