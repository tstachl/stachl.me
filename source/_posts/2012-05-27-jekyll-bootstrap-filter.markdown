---
layout: post
title: "Jekyll Bootstrap Filters"
date: 2012-05-27 22:26
comments: true
categories: Tutorial
tags: [jekyll, how to, liquid, tutorial, filter, bootstrap, twitter]
---
The blog engine [Jekyll][] runs with the templating engine [Liquid][], an extraction from the
e-commerce system [Shopify][]. It has been in production since 2006 and was initially
developed for Ruby on Rails web applications.

Liquid offers a lot of built in functionality but sometimes you want customized methods to fit
your needs. The extendability with filters, tags, generators and converters comes in handy in
these situations. Now this post won't cover all of those but the former we'll tackle today.

## Liquid Filters
Filters are basically methods that change input in customized way and the most important aspect
on filters is, that you can apply as many filters as you want on a variable. Here is an example:

    Hello {{ '{{' }} user.name | linkify: user.website }}
    Hello {{ '{{' }} user.name | append: '*' | prepend: '*' | textilize | upcase }}

28 - that's the number of filters that are delivered to your door with Liquid, some of them more
useful than others (`{{ '{{' }} 10 | divided_by: 2 }} #=> 5`) but for the most part nothing
missing. Sure there are some cases, like using Bootstrap, in which you could use some more
filters but that's what we are here for, right?

So let's get started then ...

## Creating bootstrap.rb
First we have to locate or create the plugin folder within the jekyll installation folder:

    $ cd ~/my_jekyll_blog
    $ ls -l
    total 144
    -rw-r--r--   1 tstachl  454177323     34 May 26 22:47 404.html
    [ ... ]
    drwxr-xr-x   3 tstachl  454177323    102 May 26 22:47 _plugins
    [ ... ]

As you can see mine already exists but if yours doesn't simply create one with the following
command:

    $ mkdir _plugins

Now in this folder we have to create a new file called `boostrap.rb`. This file is going to
contain all our bootstrap related plugins. Let's start off by creating a `module Bootstrap`
that's wrapping a `module Filters` and of course the register filter method like this:

{:.prettyprint .lang-ruby}
    module Bootstrap
      module Filters
        
      end
    end
    
    Liquid::Template.register_filter(Bootstrap::Filters)

The first filter we want to create is a label filter so we don't have to write
`<span class="label">My Label</span>` but instead we write `{{ '{{' }} 'My Label' | label }}`.
To accomplish that we create a new method within the Filters module:

{:.prettyprint .lang-ruby}
    def label(input)
      "<span class='label'>#{input}</span>"
    end

That's it! Save the file, start jekyll and create a new post/page using the label filter.

## Want more?
Granted bootstrap has more than the default label, like success, important, info and so on. Now
we could create a function for each of those:

{:.prettyprint .lang-ruby}
    def label_success(input)
      "<span class='label label-success'>#{input}</span>"
    end

But that's going to become annoying real soon. So let ruby create those methods for you, you
know you'll need `[:success, :warning, :important, :info, :reverse]` these additional functions
so we create a `define_method` function and auto create the methods we need.

{:.prettyprint .lang-ruby}
    [:success, :warning, :important, :info, :reverse].each do |arg|
      send :define_method, ("label_#{arg.to_s}").to_sym do |input|
        label(input)
      end
    end

As you can see we created an array with the 5 label sub categories and each of those itself is
defining a method, prepending `label_` onto the method name and calling the previously created
`label` method.

That'll work for filters like `{{ '{{' }} 'My Label' | label_success }}` now but it'll still
show up as default label because we never changed the inital label method to add another class
to the list. To do that we'll have to alter the label method:

{:.prettyprint .lang-ruby}
    def label(input, subcls = '')
      "<span class='label'>#{input}</span>" unless subcls.empty?
      "<span class='label label-#{subcls}'>#{input}</span>"
    end

If you test the code again it should still work but you won't see any changes, every label will
still render the default label. So let's amend our `define_method` function ...

{:.prettyprint .lang-ruby}
    [:success, :warning, :important, :info, :reverse].each do |arg|
      send :define_method, ("label_#{arg.to_s}").to_sym do |input|
        label(input, arg.to_s)
      end
    end

This little change is all it takes and now we can render all 5 sub categories of label without
a problem.

Here is the complete file again:

{:.prettyprint .lang-ruby}
    module Bootstrap
      module Filters
        def label(input, subcls = '')
          "<span class='label'>#{input}</span>" unless subcls.empty?
          "<span class='label label-#{subcls}'>#{input}</span>"
        end
        
        [:success, :warning, :important, :info, :reverse].each do |arg|
          send :define_method, ("label_#{arg.to_s}").to_sym do |input|
            label(input, arg.to_s)
          end
        end
      end
    end
    
    Liquid::Template.register_filter(Bootstrap::Filters)

[jekyll]: http://jekyllbootstrap.com/
[liquid]: http://liquidmarkup.org/
[shopify]: http://shopify.com/