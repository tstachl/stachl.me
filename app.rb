require 'rubygems'
require 'sinatra'
require 'jekyll'

options = Jekyll.configuration({})
set :public_folder, options['destination']
set :static, true

get '/' do
  File.read(File.join(options['destination'], 'index.html'))
end