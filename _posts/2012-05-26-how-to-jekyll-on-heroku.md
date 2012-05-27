---
layout: post
title: "Jekyll on Heroku"
description: "In this post you'll learn how to setup a Jekyll blog on Heroku."
category: "How To"
tags: [jekyll, heroku, how to, tutorial, setup, install, app]
---
{% include JB/setup %}

Before you start with this tutorial please make sure you have all prerequisites set up. 
{{ 'Important:' | label_important }} Make sure you have a working Ruby and the Gem Bundler
installed. The easiest way to do that is by installing the [Ruby Version Manager][rvm] by 
following this [Quick Install Guide][qig]. Next you also want to make sure you have the Heroku
Toolbelt installed. If you don't check out the [Toolbelt][toolbelt] website and follow the
instructions provided. Continue this tutorial once your system is set up.

## Setting up Jekyll

### Get Jekyll  
The best way to do that is cloning the Github repository `jekyll-bootstrap`, this will come with [twitter boostrap][bootstrap] included.

        $ git clone https://github.com/plusjade/jekyll-bootstrap.git my_blog
        $ cd my_blog

### Prepare Jekyll for Heroku
Once your Jekyll is downloaded/cloned we can start to prepare for [Heroku][heroku]. All we need
for our blog to run on Heroku are two files, both in the root folder of Jekyll:

        my_blog/Gemfile
        my_blog/Procfile

The first one (Gemfile) is a file for the Ruby Bundler where we define all required ruby gems
for Jekyll to run on Heroku. If you need additional packages don't hesitate to add them, this
blog for example also uses the `twitter-text` gem to allow for nice formatted tweets on the
homepage.

        source :rubygems
        
        gem "rake"                # actually not need for heroku but for the provided Rakefile
        gem "RedCloth"            # if you want to use the Textile Markup Language
        gem "jekyll", "~> 0.11.2" # we need at least this version so jekyll will use Ruby 1.9.2
        gem "foreman"             # this is a tool to test and use the Procfile locally
        gem "heroku"              # if you install the Heroku Toolbelt you won't need this but it's good practice

Now for an app to work on Heroku we need to define a Procfile. This file simply holds all
information regarding processes that Heroku will have to start for an app. Using a Procfile
and the `cedar` stack on Heroku is good for two things, one you can define any process to run
and second you have total control over your processes. Not only does this allow you to run Ruby
apps but you can run Scala, Python, Node.js and much more.

So if you ever get bored with Ruby (granted probably won't happen), so if you ever want to
broaden your horizon and take a sip of [Node][node], than you simply create another app on Heroku and
it'll run.

The Procfile is an easy oneliner ...

        web: jekyll --server $PORT

We declare one web process with the command `jekyll --server` which will generate the posts
and run jekyll's built in server. The `$PORT` allows Heroku to assign a dynamic port for the
load balancing and routing, {{ 'note' | label }} this has no influence locally. And that's
it. Well almost it - we also need to go into `_config.yml` and add those new files to the
exclude list so Jekyll won't mistake those as blog pages. Just replace the exiting list on
line 5 with this:

        exclude: [".rvmrc", ".rbenv-version", ".gitignore", "README.md", "Rakefile", "changelog.md", "Gemfile", "Gemfile.lock", "Procfile", "vendor"]

To make sure everything will work smoothly navigate to the directory and run `bundle install`
to install all the gems and then `foreman start` which will start jekyll's server.

        $ cd my_blog
        $ bundle install
        $ foreman start

Once jekyll is started navigate to [http://localhost:4000/][localhost] and you should see
the >>Hello World<< of your blog.

## On to Heroku
The Heroku bit of this blog post is equally as easy and consists of three commands. The first
will make sure that both newly created files are added to our git repository, the second
will create our app on Heroku (you'll also get a sweet herokuapp.com subdomain) and with the
third we push our app to Heroku. Heroku'll do the rest for us as in setting up the software
stack and the processes, compiling the app and launching it.

        $ cd my_blog
        $ git commit -am "Add and commit the Procfile and the Gemfile"
        $ heroku create --stack cedar mynewblog
        $ git push heroku master        
        Counting objects: 689, done.
        Delta compression using up to 4 threads.
        Compressing objects: 100% (313/313), done.
        Writing objects: 100% (689/689), 227.46 KiB | 96 KiB/s, done.
        Total 689 (delta 342), reused 672 (delta 338)
        
        -----> Heroku receiving push
        -----> Ruby app detected
        -----> Installing dependencies using Bundler version 1.2.0.pre
               Running: bundle install --without development:test --path vendor/bundle --binstubs bin/ --deployment
               Fetching gem metadata from http://rubygems.org/.......
               Installing rake (0.9.2.2)
               [ ... ]
               Using bundler (1.2.0.pre)
               Your bundle is complete! It was installed into ./vendor/bundle
               Cleaning up the bundler cache.
        -----> Discovering process types
               Procfile declares types -> web
               Default types for Ruby  -> console, rake
        -----> Compiled slug size is 5.1MB
        -----> Launching... done, v3
               http://mynewblog.herokuapp.com deployed to Heroku
        
        To git@heroku.com:mynewblog.git
         * [new branch]      master -> master

Now the second will only work if your `my_blog` directory is already a git repository otherwise
I would suggest you initialize a git repository `$ git init` before creating the Heroku app. The
toolbelt will recognize a git repository and automatically add the new remote to push it to
Heroku.

That's it your blog should now be live and accessable on [http://mynewblog.herokuapp.com/][myblog].
All that's left to say is **>>Happy Blogging<<** and if something is unclear your you love
this tutorial leave a comment.

[rvm]: https://rvm.io/
[qig]: https://rvm.io/rvm/install/
[bootstrap]: http://twitter.github.com/bootstrap/
[heroku]: http://www.heroku.com/
[toolbelt]: https://toolbelt.herokuapp.com/
[node]: http://nodejs.org
[localhost]: http://localhost:4000/
[myblog]: http://mynewblog.herokuapp.com/