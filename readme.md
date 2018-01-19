<h1 align="center">Enoki Panel</h1>

## Usage

## Blueprints

## Fields

### Structure

```
var Nanocomponent = require('nanocomponent')
var html = require('choo/html')

module.exports = class Field extends Nanocomponent {
  constructor () {
    super()
    this.state = {

    }
  }

  createElement (props) {
    this.state.value = props.value
    return html`
      <div>${props.value}</div>
    `
  }

  update (props) {
    return props.value !== state.value
  }
}
```

## Plugins

## Todo

### Design

- [x] Use gr8
- [ ] Cleanup design

### Functionality

- [ ] Load `content` into panel
- [x] Localstorage of archive urls
- [x] Store archives in state
- [ ] Read `enoki.json` for content dir