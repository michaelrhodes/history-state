# history-state
history-state allows you to monitor and make changes to a page’s history state. 

[![Browser support](https://ci.testling.com/michaelrhodes/history-state.png)](https://ci.testling.com/michaelrhodes/history-state)

## Install
```sh
$ npm install history-state
```

### API
By default, the mechanisms used are `history.pushState` and `window.onpopstate`, with older browsers falling back to `location.hash` and `window.onhashchange`. This behaviour can be overridden by passing the constructor an options object, detailed below.

```js
var state = require('history-state')({
  // Only use location.hash and window.onhashchange.
  hash: true,
  // Only use history.pushState and window.onpopstate.
  pushState: true,
  // Return false to prevent a change event from being fired.
  beforeOnChange: function() {
    if (location.pathname === '/some-bad-path') {
      return false
    }
  }
})

state.change('/some-path')
state.change('/some-other-path')
state.change('/some-bad-path')
state.change('/some-path')

state.on('change', function() {
  console.log(location.pathname)
  > '/some-path'
  > '/some-other-path'
  > '/some-path'
})

// Toggle the window listeners.
state.stop()
state.start()
```

### License
[MIT](http://opensource.org/licenses/MIT)
