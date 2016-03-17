# Xenakis Example Project

Here's an example Xenakis project.

To get started, download [this .zip file](http://f.monks.co/xenakis.zip), extract it into this folder, pull this folder up in a terminal, and run `xenakis/serve`.

* `build/` contains the built website, ready to go. it's updated when you run `xenakis/serve` or `xenakis/build`.
* `website/` is where files that should go into the built website go.
* `tags/` contains custom html tags for xenakis to use.

## deets

xenakis is a static site generator based on the idea of creating custom html tags. It's sort of like PHP includes, except you generate the website one time on your computer, instead of once-per-pageview on a rented computer.

### what xenakis does

you make a website in a folder called `website`. Except whenever you catch yourself repeating some code on multiple pages (a nav, say), you put that code into a new HTML tag (`<my-nav />`) that you can use like any other.

### custom tags

Those custom tags go in a folder called `tags`. Here's an example, which you can use with `<site-nav />`

```html
<site-nav>
  <!-- tags/site-nav.tag -->
  <h2>Pages</h2>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/art.html">Art</a></li>
    </ul>
  </nav>
</site-nav>
```

here are some rules

- every tag file must begin with a non-indented opening tag
- that tag's name becomes the tag file's name
- every tag file's name must include a hyphen
- every custom tag must be closed with a slash (<tag /> or <tag></tag>)

You can use custom tags from html files in the website folder, or from other custom tags.

## logic

see riot

https://github.com/riot/riot.github.io/blob/master/guide/index.md

## data

Pages can have metadata.

Within your website, you have access to some data: an array of every file, and the metadata for the current page.

this.mixin(GLOBAL.data)

Check out the [wiki](https://github.com/amonks/xenakis/wiki) for more info.

