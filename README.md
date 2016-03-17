# Xenakis Example Project

Here's an example Xenakis project.

## QUICK START

To get started, download [this .zip file](http://f.monks.co/xenakis.zip), extract it into this folder, pull this folder up in a terminal, and run `xenakis/serve`. Then, go to [http://localhost:3000](http://localhost:3000) to see a cool website.

* `build/` contains the built website, ready to go. it's updated when you run `xenakis/serve` or `xenakis/build`.
* `website/` is where files that should go into the built website go.
* `tags/` contains custom html tags for xenakis to use.

## deets

xenakis is a static site generator based on the idea of creating custom html tags. It's sort of like PHP includes, except you generate the website one time on your computer, instead of once-per-pageview on a rented computer.

### what xenakis does

you make a website in a folder called `website`. Except whenever you catch yourself repeating some code on multiple pages (a nav, say), you put that code into a new HTML tag (`<my-nav />`) that you can use like any other.

xenakis uses [riot.js](http://riotjs.com/guide/) under the hood, so most of their documentation applies here. Much of this page is pasted from their docs.

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

here are some rules:



## Tag syntax

You can use custom tags from html files in the website folder, or from other custom tags.

A custom tag is a combination of layout (HTML) and logic (JavaScript). Here are the basic rules:

* HTML is defined first and the logic is enclosed inside an optional `<script>` tag.
* Without the `<script>` tag the JavaScript starts where the last HTML tag ends.
* Custom tags can be empty, HTML only or JavaScript only
* Quotes are optional: `<foo bar={ baz }>` becomes `<foo bar="{ baz }">`.
* Smart ES6 like method syntax is supported: `methodName() { }` becomes `this.methodName = function() {}.bind(this)` where `this` always points to the current tag instance.
* A shorthand syntax for class names is available: `class={ completed: done }` renders to `class="completed"`when the value of `done` is a true value.
* Boolean attributes (checked, selected etc..) are ignored when the expression value is falsy: `<input checked={ undefined }>` becomes `<input>`.
* All attribute names *must be lowercase*. This is due to browser specification.
* Self-closing tags are supported: `<div/>` equals `<div></div>`. Well known "open tags" such as `<br>`, `<hr>`, `<img>` or `<input>` are never closed after the compilation.
* Custom tags always need to be closed (normally or self-closed).
* Standard HTML tags (`label`, `table`, `a` etc..) can also be customized, but not necessarily a wise thing to do.


Tag definition in tag files always starts on the beginning of the line:

```html
<!-- works -->
<my-tag>

</my-tag>

<!-- also works -->
<my-tag></my-tag>

  <!-- this fails, because of indentation -->
  <my-tag>

  </my-tag>
```

Inline tag definitions(in document body) must be properly indented, with all custom tags equally indented at the lowest indent level, mixing of tabs and spaces is discouraged.

### No script tag

You can leave out the `<script>` tag:

```html
<todo>

  <!-- layout -->
  <h3>{ opts.title }</h3>

  // logic comes here
  this.items = [1, 2, 3]

</todo>
```

In which case the logic starts after the last HTML tag. This "open syntax" is more commonly used on the examples on this website.

## logic

### Conditionals

Conditionals let you show / hide elements based on a condition. For example:

```html
<div if={ is_premium }>
  <p>This is for premium users only</p>
</div>
```

Again, the expression can be just a simple property or a full JavaScript expression. The following special attributes are available:

- `show` – show the element using `style="display: ''"` when the value is true
- `hide` – hide the element using `style="display: none"` when the value is true
- `if` – add (true value) or remove (false value) the element from the document

The equality operator is `==` and not `===`. For example: `'a string' == true`.

<span class="tag red">important</span>
Using conditionals attributes on custom nested tags does not stop riot from evaluating the hidden expressions - we are working on a patch to solve [this issue](https://github.com/riot/riot/pull/1256)


### Loops

Loops are implemented with `each` attribute as follows:

```html
<todo>
  <ul>
    <li each={ items } class={ completed: done }>
      <input type="checkbox" checked={ done }> { title }
    </li>
  </ul>

  this.items = [
    { title: 'First item', done: true },
    { title: 'Second item' },
    { title: 'Third item' }
  ]
</todo>
```

The element with the `each` attribute will be repeated for all items in the array. New elements are automatically added / created when the items array is manipulated using `push()`, `slice()` or `splice` methods for example.

## Expressions

HTML can be mixed with expressions that are enclosed in curly braces:

```js
{ /* my_expression goes here */ }
```

Expressions can set attributes or nested text nodes:

```html
<h3 id={ /* attribute_expression */ }>
  { /* nested_expression */ }
</h3>
```

Expressions are 100% JavaScript. A few examples:

```js
{ title || 'Untitled' }
{ results ? 'ready' : 'loading' }
{ new Date() }
{ message.length > 140 && 'Message is too long' }
{ Math.round(rating) }
```

The goal is to keep the expressions small so your HTML stays as clean as possible. If your expression grows in complexity consider moving some of logic to the "update" event. For example:


```html
<my-tag>

  <!-- the `val` is calculated below .. -->
  <p>{ val }</p>

  // ..on every update
  this.on('update', function() {
    this.val = some / complex * expression ^ here
  })
</my-tag>
```

### Boolean attributes

Boolean attributes (checked, selected etc..) are ignored when the expression value is falsy:

`<input checked={ null }>` becomes `<input>`.

W3C states that a boolean property is true if the attribute is present at all — even if the value is empty of `false`.

The following expression does not work:

```html
<input type="checkbox" { true ? 'checked' : ''}>
```

since only attribute and nested text expressions are valid. Riot detects 44 different boolean attributes.


### Class shorthand

Riot has a special syntax for CSS class names. For example:

```html
<p class={ foo: true, bar: 0, baz: new Date(), zorro: 'a value' }></p>
```

evaluates to "foo baz zorro". Property names whose value is truthful are appended to the list of class names. Of course you can use this notation in other places than class names if you find a suitable use case.


### Printing brackets

You can output an expression without evaluation by escaping the opening brace:

`\\{ this is not evaluated \\}` outputs `{ this is not evaluated }`


### Etc

Expressions inside `style` tags are ignored.

### Render unescaped HTML

Riot expressions can only render text values without HTML formatting. However you can make a custom tag to do the job. For example:

```html
<raw>
  <span></span>

  this.root.innerHTML = opts.content
</raw>
```

After the tag is defined you can use it inside other tags. For example

```html
<my-tag>
  <p>Here is some raw content: <raw content="{ html }"/> </p>

  this.html = 'Hello, <strong>world!</strong>'
</my-tag>
```

[demo on jsfiddle](http://jsfiddle.net/23g73yvx/)

<span class="tag red">warning</span> this could expose the user to XSS attacks so make sure you never load data from an untrusted source.

## Metadata

Pages can have metadata. Here's an example:

`website/sculpture.html`
```
---
type: art
medium: sculpture
title: ham on stand
media: [
  {
    type: image,
    src: images/art-dot-com.jpg
  }
]
---
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>A Fine Sculpture</title>
  </head>
  <body>
    <site-nav />
      <site-art it={this.page} />
    <site-footer />
  </body>

  this.mixin(GLOBAL.data)
</html>
```

Within your website, you have access to some data: an array of every file, and the metadata for the current page.

Use the line

```
this.mixin(GLOBAL.data)
```

at the end of your html to pull in the website data.

In some html with that line, you can use `this.page` to get the current page's metadata, and `this.site` to get an array of every file in the website.

On this page, for example, `{this.page.medium === 'sculpture'}`.

If you pass attributes to a custom tag, like `<site-art it={this.page}>` here, the attributes are accessible in that tag at `this.opts`. In this case, the [site-art](https://github.com/amonks/xenakis/blob/demo/tags/site-art.tag) tag uses `{{opts.it.title}` to get the value `'ham on stand'`.

### what is all this metadata good for?

In this demo repo, we have a page called [tags/art-list.tag](https://github.com/amonks/xenakis/blob/demo/tags/art-list.tag) that automatically generates a list of all the arts. (Here, "an art" means an html file in the website folder with `type: art` in its metadata.

* * *

Check out the [wiki](https://github.com/amonks/xenakis/wiki) for more info.

