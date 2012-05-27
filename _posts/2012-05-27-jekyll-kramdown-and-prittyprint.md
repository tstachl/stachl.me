---
layout: post
title: "Jekyll Kramdown and PrittyPrint"
description: "In this tutorial we'll see how to install Kramdown and Google PrettyPrint to enable syntax highlighting in Jekyll"
category: "How To"
tags: [jekyll, kramdown, prittyprint, google, bootstrap, syntax highlight, tutorial, how to, markdown]
---
{% include JB/setup %}

Jekyll ships with a markdown converter called [Maruku][], as you can see in the github repo it's
2 years since the last update on this library happend. That's pretty much how it behaves. At
first I tried to monkey patch it and add capabilities to add classes onto elements. That didn't
go over well so I tried to fetch the output before it get's written in the file and replace
the `<pre>` tags with `<pre class="prittyprint">`. That worked pretty well until I wanted to
use different languages, even though [Googles PrettyPrint][pretty] seems to come with an auto
language lookup that didn't work that good.

And all I wanted was being able to add stupid class attributes on elements, is that too much to
ask?

No! Finally I discovered in the [source code][source] of jekyll that I could use another engine
to render [markdown][]. Well I kind of saw it before but at this point I was desperate so I
looked up the documentation on [RedCarpet][], probably a really good engine. Well you guessed it
there is a but coming ... But RedCarpet didn't work on the fly and needed additional monkey
patches to work properly. So another nogo for me.

## Kramdown is coming
[Kramdown][] is another markdown render engine for Ruby and it's supported by jekyll what a rush.
The good thing about it is, it supports everything I need and probably way more, I installed it
and it worked!

Here is how ...

### Installing Kramdown
The first thing we want to do is revisit our `Gemfile` from the [first post][firstpost] when we
installed Jekyll on Heroku. All we need to do is add this line:

{:.prettyprint .lang-ruby .linenums}
        source :rubygems
        
        gem 'rake'
        gem 'kramdown'        # add this line to get kramdown installed
        [ ... ]

Now call the bundler to install kramdown:

{:.prettyprint .lang-sh .linenums}
        $ cd my_blog
        $ bundle package && bundle install

Next we need to make sure kramdown is used by jekyll to render markdown, this is done by setting
kramdown as markdown engine within the `_config.yml` file.

{:.prettyprint .lang-sh .linenums}
        [ ... ]
        auto: true
        pygments: true
        markdown: kramdown    # add this line make jekyll use kramdown
        [ ... ]

That's basically it. All you have to do now is read up on the [documentation][] and you are all
set to use the highlighter. No wait, first of all I didn't tell you how to add Google PrettyPrint
and then you might also want to know what you have to write in your .md documents to add the
class needed by Google PrettyPrint.

### Installing Google PrettyPrint
Regarding the js and css file for PrettyPrint, I have no idea what to tell you - I pretty much
stole them directly from the [Twitter Bootstrap][bootstrap] documentation page:

{:.prettyprint .linenums}
        <head>
          <link href="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css" rel="stylesheet">
          <script src="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.js"></script>
          <script>
            // make sure jQuery is loaded before you run this function,
            // probably a good idea to create an application.js loaded
            // as last js file
            $(function() {
              // make code pritty
              window.prettyPrint && prettyPrint();
            });
          </script>
        </head>

My suggestion, download those files and store them in your assets folder. In your
`_layouts/default.html` you'd simply link them with `{{ '{{' }} ASSET_PATH }}` to where ever you
put them.

Now to the fun part, adding `prettyprint lang-html linenums` to your code snippets in markdown,
ahhm kramdown:

{:.prettyprint .linenums .lang-ruby}
        {:.prettyprint .linenums .lang-ruby}
                def hello_world(name)
                  "Hello #{name}!"
                end

You are all set! If you need more information or help or if you simply love this post or you have
critisism just leave a comment in the section below.

[maruku]: https://github.com/nex3/maruku
[pretty]: http://code.google.com/p/google-code-prettify/
[source]: https://github.com/mojombo/jekyll/blob/master/lib/jekyll/converters/markdown.rb
[markdown]: http://daringfireball.net/projects/markdown/
[redcarpet]: http://rubygems.org/gems/redcarpet
[kramdown]: http://kramdown.rubyforge.org/
[firstpost]: /blog/2012/05/26/jekyll-on-heroku.html
[documentation]: http://kramdown.rubyforge.org/documentation.html
[bootstrap]: http://twitter.github.com/bootstrap/