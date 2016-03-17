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

xenakis uses [riot.js](http://riotjs.com/guide/) under the hood, so most of their documentation applies here.

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

Pages can have metadata.

Within your website, you have access to some data: an array of every file, and the metadata for the current page.

this.mixin(GLOBAL.data)

Check out the [wiki](https://github.com/amonks/xenakis/wiki) for more info.

