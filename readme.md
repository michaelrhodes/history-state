# history-state
history-state allows you to listen and make changes to a page’s history state. It with both `history.pushState` and `location.hash` changes.

[![Browser support](https://ci.testling.com/michaelrhodes/history-state.png)](https://ci.testling.com/michaelrhodes/history-state)

## Install
```sh
$ npm install history-state
```

### API
```js
var state = require('history-state')()

state.change('/push-state')
state.change('#hash')

state.on('change', function() {
  console.log(location.pathname + location.hash)
  //=> /push-state
  //=> /push-state#hash
})

// Disable/enable the change listeners.
state.stop()
state.start()
```

### License
[MIT](http://opensource.org/licenses/MIT)
