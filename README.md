define components in the `_components` folder.

Make pages in the `_pages` folder.

## components

Components are html. One key difference: any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is javascript.

### available globals

`pages` is an array of all the pages.

`page` is this page.

`attrs` is a map of the component's attrs

`children` is the component's children as html

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
