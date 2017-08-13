# Enoki Starter Kit

The Enoki starter kit is an example of common patterns used within a site. It includes [content](#content) and a [design](#site). This is **pre-alpha**, so features are missing, and the bugs are rampant.

## Features

There are so many, and more to come, but here are the favorites:

### Static files means no database

Begin building your site by creating a simple directory structure. Each [page](#pages) is a folder. Place all the assets for the pages in the related folders, and all of the text in a `.txt` file. You now are well on your way to having a 

### Javascript and JSON all the way through

[Choo](https://github.com/choojs/choo) is the default framework, which is appreciated both for it’s [simplicity](https://github.com/choojs/choo#example) and [philosophy](https://github.com/choojs/choo#philosophy). The API is lovely too. Browserify is used for it’s maturity and reliability to bundle things up. It’s worth considering what is [appropriate technology](https://en.wikipedia.org/wiki/Appropriate_technology) in relation to popular tooling and build processes.

### Modern features for free

Because we use javascript to create our static website, we can bundle that javascript and include it in our HTML output. This effectively gives you all of the benefits of server-side rendering (load-times, accessibility, deployable anywhere, etc) with none of the implementation nightmares. 

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

To setup a custom configuration, the `config.defaults.yml` file and rename it `config.yml`. You can change the options to customize your build. *More on this soon*.


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

For instance, the folder `/about` maps to `yoursite.com/about`. This is also the name of the key in the [JSON](#json) (`about: { }`).

### Each sub-folder is a sub-page

The folder name is the route. For example, the `projects` folder will have a route of `/projects`, and it’s sub-folder `01-sculpture` will have a route of `/projects/01-sculpture`. You can nest pages infinitely. If you’d like to order pages with clean urls, take a look at [sort options](#sort-options).

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

A field contains a `key` (title) and a `value` (Enoki). Fields are separated by four dashes `----`. Each `key` is available in your JSON. For instance, `about.title` or `blog.text`. You can add as many fields as you’d like at any time.

### Markdown and YAML are supported

Markdown will remain unparsed until you [choose to do so](#markdown), while YAML will be converted into JSON.

### Assets for a page are contained alongside it’s `.txt` file

As a general rule of them, if you’d like for [file](#files) (image, mp3, etc) to be associated with a [page](#pages), you should place that image within that page’s folder. This will make it accessible within `.files`.


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

## Components

## Views

### State

- [JSON](#JSON)

## JSON

```
{
  content: { },
  site: { }
}
```

## Markdown

- A note about being able to use whatever markdown library you’d like.

## Panel

Coming soon, a panel fully generated from your [blueprints](#blueprints), just like Kirby.