# history-state
history-state allows you to monitor and make changes to a page’s history state. 

[![Browser support](https://ci.testling.com/michaelrhodes/history-state.png)](https://ci.testling.com/michaelrhodes/history-state)

## Install
```sh
$ npm install history-state
```

### API
The default mechanisms are `history.pushState` and `window.onpopstate`.
Older browsers depend on `location.hash` and `window.onhashchange`.

```js
// Passing true into the constructor makes all state
// changes use location.hash regardless of whether
// the browser supports pushState.
var state = require('history-state')(true)

state.change('/some-path')

state.on('change', function() {
  console.log(location.href)
})

// Toggle the window listeners.
state.stop()
state.start()
```

### License
[MIT](http://opensource.org/licenses/MIT)
