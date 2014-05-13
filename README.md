different
=========

different is a node module for parsing git diff from a url or file.

Version
--

1.0

Be nice to me, please. Why?
--
This is my first node module. This also means PRs and issues and total re-writes are strongly encouraged! Non-constructive things are not.


How to use
--------------

```js
var different = require('different');
different.parseDiff({url: 'https://github.com/jennazee/different/commit/6798084f3a41c626b07a62552ea4c78c4a2011d6.diff'}, function(diff) {console.log(diff)});

```