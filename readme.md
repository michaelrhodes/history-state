# history-state
monitor and mutate the browser url

## install
```sh
pnpm install michaelrhodes/history-state#2.0.0
```

## use
```js
var state = require('history-state')()

state.onchange = function() {
  console.log('[onchange]', location.pathname)
}

state.push('/some-path')
> '[onchange] /some-path'

state.replace('/replaced-some-path')
> '[onchange] /replaced-some-path'

// Toggle listeners
state.stop()
state.start()
```

### obey
[MIT](http://opensource.org/licenses/MIT)
