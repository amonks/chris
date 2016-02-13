this is an example project using a forthcoming static site generator.

* * * 

define components in the `_components` folder.

Make pages in the `_pages` folder.

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

Any .things or .components in the _pages folder that have a `data.json` block with a `"component"` defined will become website pages. 

If you have a `_pages/colors.thing` that looks like this:

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

and a `_components/colors.component` that looks like this:

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

the built page will end up in `_build/colors/index.html`.

## components

Components are html. One key difference: any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is evaluated as javascript and should return a value.

### available globals

- `pages` is an array of all the pages.
- `page` is this page.
- `attrs` is a map of the component's attrs
- `children` is the component's children as html
- `site` is `/site.thing`

## special components:

```
<map collection where (condition) as reference>
  {{reference}}
</map>
```

```
<switch thing>
  option:
    something
  option:
    something else
</switch>
```

```
<if condition>
  something
<else>
  something else
</if>
```
