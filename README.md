this is an example project using a forthcoming static site generator.

* * * 

xenakis is a static site generator that aims to be as simple as possible, so it's flexible/generic enough for pros but also understandable enough for n00bs.

# example

Let's say you're making a portfolio website. Here's what you might do:

1. make a `components` and a `pages` folder
2. make a new component `components/art.component` with a template for a portfolio-item
3. for each art in your portfolio, make a new thing called `pages/[art-title].thing`
4. make a new thing called `pages/index.component` that renders a list of arts

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

A basic `pages/my-art.thing` looks like this:

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

## things

things are files that end in `.thing`.

Things are made of blocks. A block starts with `name.type:` and continues until the next block. Each block must have a unique name.

Things can have any number of blocks. Every block needs a name and a type annotation. The allowed types are json (.json), markdown (.md or .markdown) or text (.txt).

things become objects. If you have this thing:

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

it will become this object:

```json
{
  "fact": "the earth is flat",
  "properties": {
    "truthiness": 9.5
  },
  "description": "<h1>roundness</h1><p>This is a <strong>fact</strong> about the earth's shape.</p>"
}
```

## pages

Any .components in the pages folder will become website pages. Any .things in the pages folder that have a `data.json` block with a `"component"` defined will also become website pages. 

If you have a `pages/colors.thing` that looks like this:

```
data.json:
{
  "component": "colors",
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

## components

Components are html. One key difference: any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is evaluated as a javascript expression and inserted.

So, if you have a component called `components/greeting.component` that looks like this:

```
<h1>Hello there!</h1>
<p>What's your name?<p>
```

you could use `<greeting />` in a page or another component to insert that html.

Components can also include css and javascript. If your component needs css or javascript, make blocks: A component without blocks is the same as a component with one `html:` block.

```
css: 
  html { color: green; }

html:
  <p>{{attrs.text</p>
```

xenakis looks in two places for components: the `components` folder, and `~/.xenakis-components`. run `xenakis gather` to copy every component used by this project from `~/.xenakis-components` into `components`

### available globals

Within {{double-brackets}}, several useful objects are global.

- `page` is the current page, if it's a .thing rather than a .component
- `attrs` is a map of the attrs passed to the current component
- `children` is the open component's children as html

Any `.thing` in this directory tree becomes a global too. For example, `pages/my-art.thing` will be available as `pages.my-art`, and `site.thing` will be available as `site`.

## special components:

Special components look kinda like regular components, but they can do control flow. 

You can write your own, but three are built in:

### if

```
<if condition>
  <p>This will render if condition is true</p>
<else>
  <p>This will render if condition is false</p>
</if>
```

### map

```
<ul>
  <map collection where (condition) as reference>
    <li>{{reference}}</li>
  </map>
</ul>
```

### switch

```
<switch thing>
  "one":
    <p>This will render if `thing === "one"`.</p>
  "another":
    <p>This will render if `thing === "another"`.</p>
</switch>
```

