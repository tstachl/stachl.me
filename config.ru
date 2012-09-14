require 'bundler/setup'
require 'sinatra/base'
require 'rest_client'

# The project root directory
$root = ::File.dirname(__FILE__)

class SinatraStaticServer < Sinatra::Base  
  post("/comment") do
    API_KEY = ENV['MAILGUN_API_KEY']
    API_DOMAIN = ENV['MAILGUN_SMTP_LOGIN'].split('@')[1]
    API_URL = "https://api:#{API_KEY}@api.mailgun.net/v2/#{API_DOMAIN}"
    
    RestClient.post "#{API_URL}/messages",
        :from => "website@stachl.me",
        :to => "thomas@stachl.me",
        :subject => "New Comment for #{params['title']}",
        :text => "Here is the link:\n\n#{params['link']}",
        :html => "Here is the link:<br /><br /><a href=\"#{params['link']}\">#{params['title']}</a>"
  end

  get(/.+/) do
    send_sinatra_file(request.path) {404}
  end

  not_found do
    send_sinatra_file('404.html') {"Sorry, I cannot find #{request.path}"}
  end

  def send_sinatra_file(path, &missing_file_block)
    file_path = File.join(File.dirname(__FILE__), 'public',  path)
    file_path = File.join(file_path, 'index.html') unless file_path =~ /\.[a-z]+$/i  
    File.exist?(file_path) ? send_file(file_path) : missing_file_block.call
  end

end

run SinatraStaticServer