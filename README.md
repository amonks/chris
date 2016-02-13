define components in the `_components` folder.

Make pages in the `_pages` folder.

Components are html. One key difference: any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is javascript.

## special components:

```
<map collection where condition as reference>
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
