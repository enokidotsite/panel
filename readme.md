# Enoki Starter Kit

The Enoki starter kit is an example of a fully functioning website using common patterns.

## Usage

If you’ve ever used [Kirby](https://getkirby.com/), this is very similar, but using basic javascript instead of PHP.

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

Creating a page on your site requires creating a folder and placing a `.txt` file within it. To create a home [page](#pages), we simply place a `.txt` file in the root of our `/content`. 


### Each folder has a `.txt` file

The name of the `.txt` file determines the [view](#views). In the root of `/content` we named it `home.txt` because we want this [page](#pages) to use the home view. If there isn’t a matching view, it will use the `default` view.

## Pages

```
/content
  /about
    - about.txt
    - mushrooms.jpg
  /blog
    ...
  /projects
    /01-sumo
    /02-treat-your-own-back
    /03-schools
    /04-transatlatic-editions
    - projects.txt
  home.txt
```

### Assets for a page sit within it

As a general rule of them, if you’d like for an image to be associated with a [page](#pages), you should place that image within that page’s folder. This will make it accessible within `.files`.

### Each sub-folder is a sub-page

The folder name is the route. For example, the `projects` folder will have a route of `/projects`, and it’s sub-folder `01-sumo` will have a route of `/projects/01-sumo`. This is also the name of the key in the [JSON](#json). If you’d like to order pages with clean urls, take a look at [sort options](#sort-options).

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


## Panel

Coming soon, a panel fully generated from your [blueprints](#blueprints), just like Kirby.