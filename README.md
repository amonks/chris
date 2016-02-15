xenakis is a static site generator that aims to be as simple as possible, so it's flexible/generic enough for pros but also understandable enough for n00bs.

See the [the wiki](https://github.com/amonks/xenakis/wiki) for more documentation.

* * *

## What's going on?

You can use xenakis to build your own html tags. 

Let's say you're an artist with a portfolio website. Each page looks something like this:

```html
<!-- old index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>My Portfolio!</title>
  </head>
  <body>
		<header>
			<nav>
    	  <a href="/art">My Art</a>
    	  <a href="/about">About Me</a>
    	  <a href="/contact">Contact Me</a>
			</nav>
		</header>

    <h1>Charlotte: Artist!</h1>

		...

  </body>
</html>
```

With xenakis, we can build a tag to encapsulate the repeated elements and make the pages look more like this:

```html
<!-- new index.html -->
<WebsiteContainer>

	...

</WebsiteContainer
```

## Let's try it!

Most xenakis projects have three folders:

- `website/` is where you keep the files that make up your website. If you take an existing website and put it in a folder called `website/`, that's a totally valid xenakis prjoect!
- `components/` is where you keep your custom tags
- `build/` is the final website output. It's created anew every time xenakis builds your wesbite. 

If you're following along, make the `website/` and `components/` folders. xenakis will make `build/` for you later.

Inside `website/`, make a file called `index.html`. Paste the snippet above into it, the one with `<WebsiteContainer>`.

Here's where things get interesting. Inside `components/`, make a file called `WebsiteContainer.html` and paste this into it:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Portfolio!</title>
  </head>
  <body>
		<header>
			<nav>
    	  <a href="/art">My Art</a>
    	  <a href="/about">About Me</a>
    	  <a href="/contact">Contact Me</a>
			</nav>
		</header>

    <h1>Charlotte: Artist!</h1>

		{{children}}

  </body>
</html>
```

You'll notice the `{{children}}` tag. It's special. That's where xenakis will put anything that's `<WebsiteContainer>` inside `</WebsiteContainer>`.

It's time for...

### The Moment Of Truth

Open up a terminal to the folder that **contains** the `website/` and `components/` folders, Then, run `xenakis build` to make it happen.

If you've never used xenakis, run `npm install -g xenakis`. If you've never used npm (it's ok! I hadn't either until the first time! ;) ), see [the wiki](https://github.com/amonks/xenakis/wiki) for more in-depth installation instructions.

## But wait!

You can do quite a bit with what we've learned on this page alone. If you add a new link to the `<nav>`, you only have to change one file. If you moved the `<header>` into a new component, you could use `<WebsiteContainer>` on headerless pages too. 

There's a lot more to xenakis than we've covered so far. Continue to the [wiki](https://github.com/amonks/xenakis/wiki) to learn how to do cool things like:

- Set a unique title on every page by passing an attribute to `<WebsiteContainer>`.
- Automatically add a new link to your `<nav>` for each art page by using the special `<Map>` component.
- Tell xenakis to minify, gzip, and even deploy your website to free gh-pages hosting or s3.
- Build components with their own css and javascript.
