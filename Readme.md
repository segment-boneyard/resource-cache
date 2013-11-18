# script-cache

  Caches scripts in memory based on a url key. Will keep the script cached even if its origin is down to avoid frontend SPOF. Will refresh the script on `get` every `refresh` period.

  The cache fetches the scripts in the background and doesn't expose an asynchronous API to prevent performance critical script rendering code for waiting for potentially slow or down origin servers.

## Example

```js
var cache = require('script-cache')();

get('https://a.klaviyo.com/media/js/learnmarklet.js')
// null

get('https://a.klaviyo.com/media/js/learnmarklet.js')
// (function(w){Array.prototype.toJSON&&delete Array.prototype.toJSON;var M;M||(M={});(function(){function a(a){return 10>a?"0"+a:a}function b(a){e.lastIndex=0;return e.test(a)?'"'+a.replace(e,function(a){var b=i[a];return"string"===typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function c(a,d){var e,i,k,u,o=h,m,A=d[a];A&&"object"===typeof A&&"function"===typeof A.toJSON&&(A=A.toJSON(a));"function"===typeof n&&(A=n.call(d,a,A));switch(typeof A){case "string":return b(A);case "number":return isFinite(A)?""+A:"null";case "boolean":case "null":return""+A;case "object":if(!A)return"null";h+=f;m=[];if("[object Array]"===Object.pr ..
```

## API

### cache(options)

  Create a script cache with custom `options`:

```js
{
  "max": 10000, // allow maximum of 10,000 scripts
  "refresh": ms('4m'), // get the script again every 4m
  "timeout": ms('1m') // timeout fetch after 1 minute
}
```

### .get(url)

  Get the script associated with `url`. Returns null if that script isn't cached yet. Kicks off a grab if its there.

## License

```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```

Copyright (c) 2013 Segment.io &lt;friends@segment.io&gt;
