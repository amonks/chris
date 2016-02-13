this is an example project using a forthcoming static site generator.

* * * 

define components in the `components` folder.

Make pages in the `pages` folder.

## things

things are files that end in `.thing`. They can have any number of blocks. Blocks can (currently) be either json or markdown.

things become objects. If you have this thing:

```
fact.json:
"the earth is flat"

properties.json:
{
  "truthiness": 9.5
}

text.md:
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
  "text": "<h1>roundness</h1><p>This is a <strong>fact</strong> about the earth's shape.</p>"
}
```

## pages

Any .things or .components in the pages folder that have a `data.json` block with a `"component"` defined will become website pages. 

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

## components

Components are html. One key difference: any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is evaluated as javascript and should return a value.

### available globals

- `page` is the current page, if it's a .thing rather than a .component
- `attrs` is a map of the open component's attrs
- `children` is the open component's children as html

any `.thing` in this directory tree becomes a global too. For example, `pages/my-art.thing` will be available as `pages.my-art`, and `site.thing` will be available as `site`.

## special components:

use map for 
```
<ul>
  <map collection where (condition) as reference>
    <li>{{reference}}</li>
  </map>
</ul>
```

```
<switch thing>
  "one":
    <p>This will render if `thing === "one"`.</p>
  "another":
    <p>This will render if `thing === "another"`.</p>
</switch>
```

```
<if condition>
  <p>This will render if condition is true</p>
<else>
  <p>This will render if condition is false</p>
</if>
```
