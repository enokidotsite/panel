# Enoki Starter Kit

The Enoki starter kit is an example of common patterns used within a site. It includes [content](#content) and a [design](#site). This is **pre-alpha**, so features are missing, and the bugs are rampant.


## Features

There are so many, and more to come, but here are the favorites:

### Static files means no database

This also means no installation. Begin building your site by creating a simple directory structure. Each [page](#pages) is a folder. Place all the [assets](#files) for the pages in the related folders, and all of the text in a `.txt` file. You now are well on your way to having a 

### Javascript and JSON all the way through

[Choo](https://github.com/choojs/choo) is the default framework, which is appreciated both for it’s [simplicity](https://github.com/choojs/choo#example) and [philosophy](https://github.com/choojs/choo#philosophy). The API is lovely too. Browserify is used for it’s maturity and reliability to bundle things up. It’s worth considering what is [appropriate technology](https://en.wikipedia.org/wiki/Appropriate_technology) in relation to popular tooling and build processes.

### Modern features with none of the headache

Because we use javascript to create our static website, we can bundle that javascript and include it in our HTML output. This effectively gives you all of the benefits of server-side rendering (load-times, accessibility, deployable anywhere, etc) with none of the implementation nightmares. 

## Sections

- [Usage](#usage)
- [Structure](#structure)
- [Content](#content)
  - [Pages](#pages)
  - [Files](#files)
- [Site](#site)
  - [Assets](#assets)
  - [Blueprints](#blueprints)
  - [Components](#components)
  - [Plugins](#plugins)
  - [Views](#views)

## Usage

```
# clone
git clone https://github.com/jondashkyle/enoki-starterkit.git

# install
cd enoki-starterkit && npm install

# npm scripts

npm start      # run enoki local server
npm run dev    # run configurable dev server
npm run build  # build your static site
```

- **`npm start`** to spin up an Enoki development server
- **`npm run dev`** for a fully configurable setup using the [browserify transform](#browserify-transform)
- **`npm run build`** to generate your static site and bundle the js

## Structure

```
/starter-kit
  /content
  /site
  - config.defaults.yml
  - package.json
```

Enoki expects your project to contain directories, [**content**](#content) and [**site**](#site).

### [Content](#content) sets your structure contains your static files

The structure of your site is determined based on the structure of folders, and the text files within them. Things like images and pdfs, but most importantly `.txt` files, which store your copy and data.

### [Site](#site) contains your source files

This is where the code which creates your site lives. This is mostly javascript and css, and any global static assets like web fonts. The starter kit uses [Choo](https://github.com/choojs/choo)!

### Configuration and Dependencies

**`package.json`**

Since this is built entirely in javascript, you can install any module you’d like off of [npm](http://npm.org). [NPM scripts](http://substack.net/task_automation_with_npm_run) are also a great sane alternative to complicated tooling like webpack. There are several scripts and modules used in the starter-kit, which we’ll get into below.

**`config.defaults.yml`**

To setup a custom configuration, the `config.defaults.yml` file and rename it `config.yml`. You can change the options to customize your build. *More soon…*


## Content

```
/content
  /about
  /blog
  /projects
  - home.txt
```

### Each folder is a [page](#pages)

Creating a page on your site requires creating a folder and placing a [`.txt`](#pages) file within it. To create a home [page](#pages), we simply place a `.txt` file in the root of our `/content`. 

### The folder name is the pathname

For instance, the folder `/about` maps to the route `yoursite.com/about`. This is also the name of the key in the [JSON](#json) (`about: { }`).

### Each sub-folder is a sub-page

The folder name is the route. For example, the `projects` folder will have a route of `/projects`, and it’s sub-folder `01-sculpture` will have a route of `/projects/01-sculpture`. You can nest pages infinitely. If you’d like to order pages with clean urls, take a look at [sort options](#sort-options).

### Examples

<details>
<summary>Folder names and how they map to routes and JSON</summary>

| Folder name | URL path | JSON key |
|-------------|----------|----------|
| / | / | content |
| /about | /about | content.children.about |
| /projects/01-sculpture | /projects/01-sculpture | content.children.projects.children[01-sculpture] |

</details>


## Pages

```
/content
  /about
    - about.txt
    - mushrooms.jpg
  /blog
    ...
  /projects
    /01-sculpture
    /02-treat-your-own-back
    /03-schools
    /04-transatlatic-editions
    - projects.txt
  home.txt
```

### Each page has a `.txt` file

The name of the `.txt` file determines the [view](#views). In the root of `/content` we named it `home.txt` because we want this [page](#pages) to use the home view. If there isn’t a matching view, it will use the `default` view.

### The contents of a `.txt` file are fields

A field contains a `key` (title) and a `value` (Enoki). Fields are separated by four dashes `----`. Each `key` is available in your JSON. For instance, `about.title` or `blog.text`. You can add as many fields as you’d like at any time.

### Markdown and YAML are supported

Markdown will remain unparsed until you [choose to do so](#markdown), while YAML will be converted into JSON.

### Assets for a page are contained alongside it’s `.txt` file

As a general rule of them, if you’d like for [file](#files) (image, mp3, etc) to be associated with a [page](#pages), you should place that image within that page’s folder. This will make it accessible within `.files`.

### Examples

<details>
<summary>Contents of a .txt file, showing fields (keys and values)</summary>

```
title: Enoki
----
tags:
  - platform
  - cms
  - toolset
----
text: Enokitake, also Enokidake or Enoki, are cultivars of Flammulina velutipes, also known by the name golden needle mushroom or lily mushroom.
```

</details>

## Site

```
/site
  /assets
  /blueprints
  /components
  /plugins
  /views
  - app.js
  - index.js
```

- [**Assets**](#assets) are static files like CSS, and your site’s wrapper template
- [**Blueprints**](#blueprints) define the taxonomy of your [views](#views)
- [**Components**](#components) are re-usable snippets of code
- [**Plugins**](#plugins) set your site’s [state](#state), and extend it’s functionality
- [**Views**](#views) are linked to your [routes](#routes), and digest state for [components](#components)

### `app.js` connects your site with Enoki

You shouldn’t need to touch this, but feel free to extend and customize your installation here.

### `index.js` is your primary entry point

This is where we setup our Choo application, and include any plugins and custom routes. At the bottom of the file we either mount the app if in the browser (browserified), or export the app if being required within node (for static output).

### Examples

<details id="test">
<summary>Mounting and exporting the app</summary>

```js
// if we are in node
if (module.parent) {
  // export the application to generate static output
  module.exports = app
// if in the browser
} else {
  // mount and initialize the application
  app.mount('main')
}
```

</details>

## Assets

```
/site
  /assets
    - index.css
    - index.html
```

### Global static files

These are static files like css, web fonts, and such that you will use across your site.

### Custom `index.html` template

If you place an `index.html` file within `/assets`, you can define the structure of the document your site mounts to. This lets you define custom `head` tags, like open-graph and viewport. Your site mounts to the `<main></main>` tag. Forgetting to include that will result in a very blank website!

- Overrides default template
- Great for defining custom `head` tags
- Must include `<main></main>`

## Blueprints

▼ Blueprint formatting

```
title: Page

fields:
  title:
    label: Title
    type:  text

  text:
    label: Text
    type:  textarea
```

<details>
<summary>Directory contents</summary>

```
/site
  /blueprints
    - about.yml
    - blog.yml
    - default.yml 
    ...
```

</details>

### Blueprints correspond with [views](#views)

Blueprints define the [fields](#the-contents-of-a-txt-file-are-fields) of a view. They are used to generate the interface for your [Panel](#panel). *More soon…*

### YAML Formatting



### Filename matches that of the [view](#views)

The name of a blueprint corresponds with a view. For example, to create a blueprint for the `about` view (`site/views/about.js`), create a blueprint named `about.yml` inside `site/blueprints/`.

### Available fields

| name | description | value |
| - | - | - |
| tags | a dynamic tag field | array |
| text | is a single line text input | string |
| textarea | is a multi-line textarea | string |

This list will expand in the future to be (mostly) in parity with [Kirby](https://getkirby.com/docs/panel/blueprints/form-fields).

## Components

```
/site
  /components
  - format.js
  - thumbnail.js
  - wrapper.js
```

### Components are reusable snippets of code

This is a convenience directory, as you can `require()` from any directory within your build.

### `format.js` handles markdown and escaping `innerHTML`

Format is used to parse [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). It uses [`nano-markdown`](https://github.com/Holixus/nano-markdown), but you can replace it with whatever markdown parser you prefer. It also lets you use escaped HTML within [bel](https://github.com/shama/bel) (Choo uses it to create DOM elements) on the server and in the browser.

### `thumbnail.js` is an example of a re-usable component

Instead of re-writing the same code in multiple views within your site, consider modularizing and passing options to a component. This is an example of a thumbnail component.

### `wrapper.js` is an example of a global header/footer

It can be annoying to require a global elements in each view. Instead, you can create a [composable function](http://blog.ricardofilipe.com/post/javascript-composition-for-dummies) which accepts a [`view`](#views), and wrap it around the `exports` of your view.

### Examples

<details>
<summary>Usage from within a view</summary>

```js
var format = require('../components/format')
var content = format('hello!')
```

</details>

<details>
<summary>Composable component (wrapper.js) within a view</summary>

```js
/**
 * wrapper.js
 */

var html = require('choo/html')
module.exports = wrapper

// accept a view as the only arg
function wrapper (view) {
  // return our composition, accepting choo’s state and emit as args
  return function (state, emit) {
    // return our wrapper, calling the view and passing choo’s args
    return html`
      <main>
        <header>Hello!</header>
        ${view(state, emit)}
        <footer>Bye!</footer>
      </main>
    `
  }
}

/**
 * view.js
 */
var html = require('choo/html')
var wrapper = require('../components/wrapper')

// wrap our view
module.exports = wrapper(view)

```

</details>

## Plugins

```
/site
  /plugins
  - scroll.js
```

### Plugins extend Choo’s [state](#state) and events

They hook onto [Choo’s `use()` method](https://github.com/choojs/choo#example), and can be called from within your `/site/index.js` file.

### The example is to set scroll position on navigation

We listen to Choo’s [`NAVIGATE` event](https://github.com/choojs/choo#pushstatestateeventspushstate), and scroll to the top of the page when it’s called.

### Examples

<details>
<summary>Listening to an event</summary>

```js
module.exports = scroll

function scroll (state, emitter) {
  emitter.on(state.events.NAVIGATE, function () {
    window.scrollTo(0, 0)
  })
}
```

</details>

<details>
<summary>Extending state</summary>

```js
module.exports = header

function header (state, emitter) {
  state.events.HEADER = 'header'
  state.events.FOOTER = 'footer'

  state.header = {
    title: 'Hello!',
    footer: 'Bye!'
  }

  emitter.on(state.events.HEADER, function (data) {
    if (typeof data === 'string') {
      state.header.title = data
    }
  })

  emitter.on(state.events.FOOTER, function (data) {
    if (typeof data === 'string') {
      state.footer.title = data
    }
  })
}
```

</details>

## Views

```
/site
  /views
  - about.js
  - blog.js
  - default.js
  ...
  - notfound.js
  ...
```

### Views are bound to the router

A view accepts Choo’s [`state`](https://github.com/choojs/choo#state) and [`emitter`](https://github.com/choojs/choo#events) as it’s only arguments. It then digests the state to be usable within [`components`](#components), or the view itself.

### View filenames correspond with [pages](#pages) and [blueprints](#blueprints)

For example, the view `/site/views/project.js` will be associated with `/content/projets/01-sculpture/project.txt`, and the `site/blueprints/project.yml` blueprint.

### Examples

<details>
<summary>Default view (default.js)</summary>

```js
var html = require('choo/html')
var wrapper = require('../components/wrapper')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="x xw xjc c12 p1">
      <div class="p1 c8 sm-c12">
        <div class="fs2 fwb">${state.page.title}</div>
      </div>
      <div class="c8 sm-c12 p1 copy">
        ${format(state.page.text)} 
      </div>
    </div>
  `
}
```

</details>

## Panel

Coming soon, a panel fully generated from your [blueprints](#blueprints), just like Kirby. *More soon…*

## JSON and State

```
{
  content: { },
  site: { }
}
```

### At it’s core, Enoki transforms a directory into JSON

You then use this JSON to populate the initial state of a javascript application. In this starter kit we are generating a static html website with that input, and bundling the javascript along side it to fully hydrate the site on load.

### Enoki exposes a single object

This object contains two sub-objects: `content` and `site`. These objects mirror the [directory structure](#directory-structure) above so you can generate your site.

### Everything is an object, but use Array methods for looping

Using array methods is a super easy way of looping over objects such as `children` and `files`. However, you first need to turn the objects into arrays using `Object.values()`, `Object.keys()`, or modules like [`object-values`](https://www.npmjs.com/package/object-values) and [`object-keys`](https://www.npmjs.com/package/object-keys), which are included in this starter kit.

This way of thinking is aligned with [functional programming](http://cryto.net/~joepie91/blog/2015/05/04/functional-programming-in-javascript-map-filter-reduce/).

### Content object

The root of your `content` object is simply a [`page`](#page-object). 

### Page object

| Key | Description | Value |
| - | - | - | 
| children | the directory’s sub-directories | object | 
| dirname | the name of the directory | string |
| file | the filename of the page [`.txt`]((#https://github.com/jondashkyle/enoki-starterkit/tree/dev#the-contents-of-a-txt-file-are-fields)) | string |
| files | files contained within the page | object |
| path | the path of the directory relative to `/content` | string
| view | the name of the [`view`](#views) | string |
| url | the direct url to the page | string |

- Each [field](#https://github.com/jondashkyle/enoki-starterkit/tree/dev#the-contents-of-a-txt-file-are-fields) of your page `.txt` file will be merged with page object.
- Fields are defined with [blueprints](#blueprints)
- In addition to this, these default fields are exposed.

### File object

| Key | Description | Value |
| - | - | - | 
| dirname | the parent directory name | string |
| extension | the file extension | string |
| filename | the filename | string |
| name | the filename without extension | string |
| path | the path relative to the `content` directory | string |
| type | the [type](#file-types) of file | string |
| url | the path relative to the `content` directory |

- If you’ve created a meta `.txt` for a file, it’s fields will merged with the file object.

### Site object

This will be documented once the Panel has been published. *More soon…*

