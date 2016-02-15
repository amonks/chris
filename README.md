this is an example project using a forthcoming static site generator.

* * * 

xenakis is a static site generator that aims to be as simple as possible, so it's flexible/generic enough for pros but also understandable enough for n00bs.

> simple not easy. 
> 
> go is hard but simple: you can learn the rules in two sentences.
> Chess is hard but complex: you need some time to learn the rules

Here are my goals:

I want the power of structure/control flow/templating but I want it to feel like vanilla html. I want it to feel like a language (html), not like a framework. This is to html what scss is to css, *not* what jekyll is to html. 

- You don't need a special generator to create the right file structure: if you take an existing html website and stick it in a folder called "website", that is a totally valid xenakis project.
- The components look like regular html files. You call them with regular html tags and pass data using regular html attrs.
- There are no config files

## thoughts

rn this documentation is pretty complete, not very n00b friendly. I'm tryna work on defining exactly what (how little) information needs to be conveyed b4 i work out how to convey it learnably.

**Here is a running list of basic things a new user would need to learn before getting any value out of this at all:**

* running a command in a terminal in general as an act
* "woah I can make my own html tags!"
  * {{syntax}} for switching languages (getting attrs)
* stuff needs to be in the right place (./components, ./website)

**Here is a running list of next steps**:

* weird `.component` files with blocks in them
  * which in turn introduces significant whitespace...
* arcane rules about blocks and their names << simplify this

**Here is a running list of things an *intermediate* user could learn to use it better**:

* html-less components // generation
  * <syntax /> 4 several `special components`
    * map
    * if
    * switch
* build up a personal library of components for re-use

**Here is a running list of things that an *advanced* user could do to use it custom**:

* throw in a new gulp task to process a different filetype (.less! .es6! .hbs!)

### questions

**blocks**

is this .component/block crap really better than just files with the
same name but different extensions? I like that it makes components
self-contained, but it'll throw of highlighting in ppls editors and a
new filetype is kinda inherently complex.

**special components**

I like that they feel like html to use, but I'm thinking about switching
to syntax for inserting regular javascript control. 

pros/cons:

- it'd feel less like regular html
- making *new* control would feel more like regular javascript ("special
components" are probably sweet.js macros)
- I think my target audience includes both [ppl who aren't comfortable
with javascript at all] and [ppl who are very comfortable with
javascript], but I'm not sure how to best to serve that whole spectrum

**building**

Idk how hard it's gonna be to automatically webpack all the individual css and js blocks from components together. The simplest approach would be to leave everything in separate files and call it "http/2 optimized".

I think it makes sense to run all js through babel by default. scss seems pretty safe too. The build process has to be all nice and modular so super-advanced users can add support for their favorite preprocessors. I wonder if I can take a cue from [slush](http://slushjs.github.io/#/) about using vanilla npm for plugins.

# example

Let's say you're making a portfolio website. Here's what you might do:

1. make a `components` and a `website` folder
2. make a new component `components/art.component` with a template for a portfolio-item
3. for each art in your portfolio, make a new component called `website/[art-title].component`
4. make a new component called `website/index.component` that renders a list of arts

A basic `components/art.component` looks like this:

```html
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

A basic `website/index.component` looks like this:

```html
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

A basic `website/my-art.component` looks like this:

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

### building your website

run `xenakis build` in this folder to build the website. You'll get a new folder, `build`, that you can ftp over to your web host.

run `xenakis gh-pages` in this folder to build the website (you'll get a 'build' folder) and then copy it into a branch called `gh-pages`.

I'll probably add arguments for minification and whatnot.

### components

Websites are made up of components. Components in your `website` folder turn into pages on your website. Any other stuff in your website folder is copied straight-over into your website, and gzipped if appropriate. Components in your `components` folder can be used like html tags from other components.

Components are made of blocks. A block starts with `name.type:` or just `type:` and continues until the next block. Each block must have a unique name. If a block declaration lacks a name, that block's type becomes its name. `html:` and `html.html:` are equivalent.

Components can have any number of blocks. Every block needs a name and a type annotation. The allowed types are html (.html), json (.json), markdown (.md), plain text (.txt), javascript (.js), and css (.css).

The default block is called `html`. A component without block declarations has one block: `html`. The following two components are equivalent:

```
html:
  <p>hi</p>
```

```html
<p>hi</p>
```

### html in components

Within an html block, any tag that is a component **or** a *special component* renders that component instead of just the html tag. Also, anything {{double-wrapped}} is evaluated as a javascript expression and inserted.

xenakis looks in two places for components: the `components` folder, and `~/.xenakis-components`. run `xenakis gather` to copy every component used by this project from `~/.xenakis-components` into `components`

So, if you have a component called `components/greeting.component` that looks like this:

```html
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

- `page` is the root component (in the website folder). It might be the current component or it might have called the current component.
- `this` is the current component. It might be the same as `page`, or it might not.
- `attrs` is a map of the attrs passed to the current component, if the current component was called from html with attrs.
- `children` is the current component's children as html, if the current component was called from html and has child tags within it.

Any `.component` in this directory tree becomes a global too. For example, `website/my-art.component` will be available as `website.my-art`, and `site.component` will be available as `site`.

- `pages` is an alias to `website`.

### pages

Any .components in the website folder will become website pages.

If you have a `website/colors.component` that looks like this:

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

```html
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

Components in the `website` folder have an extra key when they're accessed as data: `url`. `url`'s value is the relative url that the page will end up at. In this example, `"/colors"`.

