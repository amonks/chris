this is an example project using a forthcoming static site generator.

* * * 

xenakis is a static site generator that aims to be as simple as possible, so it's flexible/generic enough for pros but also understandable enough for n00bs.

# example

Let's say you're making a portfolio website. Here's what you might do:

1. make a `components` and a `pages` folder
2. make a new component `components/art.component` with a template for a portfolio-item
3. for each art in your portfolio, make a new component called `pages/[art-title].component`
4. make a new component called `pages/index.component` that renders a list of arts

A basic `components/art.component` looks like this:

```
<html>
  <head>
    <title>{{page.title}}</title>
  </head>
  <body>
    <h1>{{page.title}}</h1>
    {{page.text}}
  </body>
</html>
```

A basic `pages/index.component` looks like this:

```
<html>
  <head>
    <title>All my arts</title>
  </head>
  <body>
    <h1>These are all my arts:</h1>
    <ul>
      <map pages where (component === 'art') as an_art>
        <li>
          <a href={{an_art.url}}>
            {{an_art.title}}
          </a>
        </li>
      </map>
    </ul>
  </body>
</html>
```

A basic `pages/my-art.component` looks like this:

```
data.json:
{
  "component": "art",
  "title": "My Art"
  ]
}

text.md:
One time I made a cool art about *the real*.
```

The resultant website will have the following directory structure:

* `index.html`
* `my-art/index.html`

This very repository includes a more fleshed-out iteration of this example.

# documentation

### components

Websites are made up of components. Components in your `pages` folder turn into pages on your website. Components in your `components` folder can be used like html tags from other components.

Components are made of blocks. A block starts with `name.type:` or just `type:` and continues until the next block. Each block must have a unique name. If a block declaration lacks a name, that block's type becomes its name. `html:` and `html.html:` are equivalent.

Things can have any number of blocks. Every block needs a name and a type annotation. The allowed types are html (.html), json (.json), markdown (.md), plain text (.txt), javascript (.js), and css (.css).

The default block is called `html`. A component without block declarations has one block: `html`. The following two components are equivalent:

```
html:
  <p>hi</p>
```

```
<p>hi</p>
```

### html in components

Within an html block, any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is evaluated as a javascript expression and inserted.

xenakis looks in two places for components: the `components` folder, and `~/.xenakis-components`. run `xenakis gather` to copy every component used by this project from `~/.xenakis-components` into `components`

So, if you have a component called `components/greeting.component` that looks like this:

```
<h1>Hello there!</h1>
<p>What's your name?<p>
```

you could use `<greeting />` in a page or another component to insert that html.

Any time a component is rendered, the blocks called `html`, `css`, and `js` are inserted into the website output if they exist. `template:` is a special block. It's value should be the name of a second component to use while rendering the initial component. More on this later.

Markdown blocks are treated as html. The following two blocks are equivalent:

```
html:
<h1>Hello!</h1>
```

```
html.md:
# Hello!
```

### special components:

There are several special components available for control flow within html blocks.

You can write your own, but three are built in:

#### if

```
<if condition>
  <p>This will render if condition is true</p>
<else>
  <p>This will render if condition is false</p>
</if>
```

#### map

```
<ul>
  <map collection where (condition) as reference>
    <li>{{reference}}</li>
  </map>
</ul>
```

#### switch

```
<switch thing>
  "one":
    <p>This will render if `thing === "one"`.</p>
  "another":
    <p>This will render if `thing === "another"`.</p>
</switch>
```

### components as data

Components can be accessed as objects within other components. If you have this component at `facts/the_earth.component`:

```
fact.json:
"the earth is flat"

properties.json:
{
  "truthiness": 9.5
}

description.md:
# roundness

This is a **fact** about the earth's shape.
```

Other components will have a global defined at `facts.the_earth` with this value:

```json
{
  "fact": "the earth is flat",
  "properties": {
    "truthiness": 9.5
  },
  "description": "<h1>roundness</h1><p>This is a <strong>fact</strong> about the earth's shape.</p>"
}
```

### available globals

Within {{double-brackets}} in html blocks, and within javascript blocks, several useful objects are global.

- `page` is the root component (in the pages folder). It might be the current component or it might have called the current component.
- `attrs` is a map of the attrs passed to the current component, if the current component was called from html with attrs.
- `children` is the current component's children as html, if the current component was called from html and has child tags within it.

Any `.component` in this directory tree becomes a global too. For example, `pages/my-art.component` will be available as `pages.my-art`, and `site.component` will be available as `site`.

### pages

Any .components in the pages folder will become website pages.

If you have a `pages/colors.component` that looks like this:

```
data.json:
{
  "template": "colors",
  "title": "Beautiful Colors"
}

text.md:

## colors

- red
- green
- blue
```

and a `components/colors.component` that looks like this:

```
<html>
  <head>
    <title>{{page.data.title}}</title>
  </head>
  <body>
    {{page.text}}
  </body>
</html>
```

the built page will end up in `build/colors/index.html`.

Things in the `pages` folder have an extra key: `url`. `url`'s value is the relative url that the thing will end up at. In this example, `"/colors"`.

