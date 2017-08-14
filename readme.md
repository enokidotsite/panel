# Enoki Starter Kit

[Enoki](https://github.com/jondashkyle/enoki) is a tool for making full websites.

This (*pre-alpha*) starter-kit is an example of how you might structure an Enoki site. It includes [content](#content) and a [design](#site). It's a bit like the [Kirby](https://github.com/getkirby/starterkit) starter-kit, but built entirely in javascript and uses [Choo](https://github.com/choojs/choo) for the front-end.

## Example

The starter-kit generates a [fully hydrated](#features) static website. Take a [look at the output](https://enoki-starterkit-jkm.hashbase.io/).

## Sections

- [Usage](#usage)
- [Structure](#structure)
- [Content](#content)
- [Site](#site)
- [Features](#features)

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
- **`npm run build`** to [generate your static site](#building) and bundle the js

## Structure

```
/starter-kit
  /content
  /site
  - config.defaults.yml
  - package.json
```

### [Content](#content) contains your site content

This is where the text and files for your site live. This includes things like images and pdfs, but most importantly `.txt` files, which store your copy and data. The structure of your site is determined based on the structure of this folder.

### [Site](#site) contains your site code

This is where the code which creates your site lives. This is mostly javascript and css, and any global static assets like web fonts. The starter kit uses [Choo](https://github.com/choojs/choo)!

### Configuration and Dependencies

**`package.json`**

Since this is built entirely in javascript, you can install any module you’d like off of [npm](http://npm.org). [NPM scripts](http://substack.net/task_automation_with_npm_run) are also a great sane alternative to complicated tooling like webpack. The starter-kit includes several scripts and modules already, which we’ll get into below.

**`config.defaults.yml`**

To setup a custom Enoki configuration, rename the `config.defaults.yml` file to `config.yml`. This is where you can change options to customize your build. *More soon…*


## Content

```
/content
  /about
  /blog
  /projects
  - home.txt
```

### Each folder is a [page](#pages)

Create a page on your site by creating a folder and placing a [`.txt`](#pages) file within it. To create a home [page](#pages), we place a `.txt` file in the root of `/content`. 

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

The name of the `.txt` file determines which [view](#views) will be used to render the page. If there isn’t a matching view, it will use the `default` view.

### The contents of a `.txt` file are fields

A field contains a `key` (title) and a `value` (Enoki). Fields are separated by newlines and four dashes `----`. Each `key` is available in your JSON. For instance, `about.title` or `blog.text`. You can add as many fields as you’d like at any time.

### Markdown and YAML are supported

Markdown will remain unparsed until you [choose to do so](#markdown), while YAML will be converted into JSON. You can use the [`format.js`](#formatjs-handles-markdown-and-escaping-innerHTML) component within the starter kit for rendering.

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

## Files

### Assets for a page are contained alongside it’s `.txt` file

As a general rule of them, if you’d like for [file](#files) (image, mp3, etc) to be associated with a [page](#pages), you should place that image within that page’s folder. This will make it accessible within `.files`.

## Site

```
/site
  /assets
  /components
  /plugins
  /views
  - app.js
  - index.js
```

### **`app.js`** is the glue between Enoki and Choo

Returns a function which sets up the routes for our site based on the structure of our content folder, and transforms the content folder into [JSON](#json-and-state) for use within our site! You don’t need to touch this file—extending your site happens in `index.js`.

### **`index.js`** sets up the Choo app

You’ll see our app is wrapped in the function from `app.js`.

### **`/views`** contains the views of your site

This folder must contain the views for your site. The names of the files correspond to the names of the `.txt` files in your content folder. A views is bound to directory the router, and accepts Choo’s [`state`](https://github.com/choojs/choo#state) and [`emitter`](https://github.com/choojs/choo#events) as it’s only arguments.

### **`/assets/index.html`** is your site wrapper template

Feel free to modify this file, but don't forget the `<main></main>` tag. This is where we mount the Choo app, so forgetting to include that will result in a very blank website!

### The rest is just Choo!

The remaining folders and files are our take on a good way to structure the rest of your site code:

- **`/assets`** contains static files like CSS, and your site’s wrapper template
- **`/components`** contains re-usable snippets of code. We've included a few for [site layout](), [markdown formatting](), and [image thumbnails]().
- **`/plugins`** contains Choo plugins which modify your site's state and extends your site's functionality. We've included one which [resets scroll position]() when navigating to a new page.

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

#### Notes

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

#### Notes

- If you’ve created a meta `.txt` for a file, it’s fields will merged with the file object.

### Site object

This will be documented once the Panel has been published. *More soon…*

## Building

Great! By now hopefully you can navigate your way around using Enoki with the starter kit, and have an idea of how to start from scratch. Now to build your site.

### Building generates a static site

When you run the `build` command, a few things happen behind the scenes:

- Copy the `content/` directory into `public/`
- This copies all of your static files
- Transform the `content/` into [JSON](#json-and-state)
- Pre-render each [page](#pages) route into an `index.html` file

### Bundle your javascript and serve it alongside your HTML

In addition to creating a fully static HTML site, you can bundle your javascript and serve it alongside your HTML output. This makes your site fully hydrated / isomorphic, giving you all the benefits of server-side rendering (speed, accessibility, etc) with none of the complications.

### Upload to any static host

Because it’s static HTML and javascript, you can upload this to any host, such as an Amazon S3 Bucket. There is also zero server configuration needed!

Much more interesting and exciting than this though is publishing to the distributed web. It’s suggested to take a look at [Beaker Browser](http://beakerbrowser.com) and [Hashbase](http://hashbase.io)! *More soon…*

## Features

### Static files means no database

This also means no installation. Begin building your site by creating a simple directory structure. Each [page](#pages) is a folder. Place all the [assets](#files) for the pages in the related folders, and all of the text in a `.txt` file. You now are well on your way to having a 

### Javascript and JSON all the way through

[Choo](https://github.com/choojs/choo) is the default framework, which is appreciated both for it’s [simplicity](https://github.com/choojs/choo#example) and [philosophy](https://github.com/choojs/choo#philosophy). The API is lovely too. Browserify is used for it’s maturity and reliability to bundle things up. It’s worth considering what is [appropriate technology](https://en.wikipedia.org/wiki/Appropriate_technology) in relation to popular tooling and build processes.

### Modern features with none of the headache

Because we use javascript to create our static website, we can bundle that javascript and include it in our HTML output. This effectively gives you all of the benefits of server-side rendering (load-times, accessibility, deployable anywhere, etc) with none of the implementation nightmares. 

### Automatically generated admin Panel

Great for client projects and creating your site without ever having to touch code. This is very far along, but not yet included in the starter kit. *More soon…*

## Wrapping it up

This is pre-alpha! When you come across a bug, or have feedback, please feel free to create an issue. It’d be great to start a conversation around what is needed, and what isn’t.

For updates, visit [http://enoki.site](http://enoki.site)
