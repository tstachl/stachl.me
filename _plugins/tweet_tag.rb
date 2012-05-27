# A Liquid tag for Jekyll sites that allows embedding tweets using Twitter's
# oEmbed API, and showing the tweet as a blockquote for non-JavaScript enabled
# browsers and readers.
#
# Author: Scott W. Bradley
# Source URL: https://github.com/scottwb/jekyll-tweet-tag
#
# Example usage:
#   {% tweet 159849628819402752 %}
#
# Documentation:
#   https://github.com/scottwb/jekyll-tweet-tag/blob/master/README.md
#
require 'json'
require 'net/http'
require 'digest/md5'
require 'uri'
require 'twitter-text'

module Jekyll
  class TweetsTag < Liquid::Tag
    include Twitter::Autolink
    
    TWITTER_TIMELINE_URL = "http://api.twitter.com/1/statuses/user_timeline.json"
    TWITTER_STATUS_URL = "https://api.twitter.com/1/statuses/show.json"
    TWITTER_SHOW_URL = "https://api.twitter.com/1/statuses/show.json"
    
    def initialize(tag_name, text, tokens)
      super
      @tag_name       = tag_name
      @text           = text
      @cache_disabled = false
      @cache_folder   = File.expand_path "../.cache", File.dirname(__FILE__)
      FileUtils.mkdir_p @cache_folder
    end
    
    def render(context)
      self.send(@tag_name, context)
    end
    
    def tweets(context)
      @url = TWITTER_TIMELINE_URL
      html_output_for(api_params())
    end
    
    def tweetsnocache(context)
      @cache_disabled = true
      tweets(context)
    end
    
    def tweet(context)
      @url = TWITTER_STATUS_URL
      html_output_for(api_params('id'))
    end
    
    def tweetnocache(context)
      @cache_disabled = true
      tweet(context)
    end
    
    def html_output_for(api_params)
      body = "<div class=\"alert alert-error\"><strong>Oh snap!</strong> Tweet(s) could not be processed.</div>"
      if response = cached_response(api_params) || live_response(api_params)
        body = response_to_html(response) || body
      end
      "<div class=\"tweets\">#{body}</div>"
    end
    
    def api_params(param_name = 'screen_name')
      args       = @text.split(/\s+/).map(&:strip)
      
      api_params = {}
      api_params[param_name] = args.shift
      
      args.each do |arg|
        k,v = arg.split('=').map(&:strip)
        if k && v
          if v =~ /^'(.*)'$/
            v = $1
          end
          api_params[k] = v
        end
      end
      
      api_params
    end
    
    def cache(api_params, data)
      cache_file = cache_file_for(api_params)
      File.open(cache_file, "w") do |f|
        f.write(data)
      end
    end
    
    def cached_response(api_params)
      return nil if @cache_disabled
      cache_file = cache_file_for(api_params)
      JSON.parse(File.read(cache_file)) if File.exist?(cache_file)
    end
    
    def url_params_for(api_params)
      api_params.keys.sort.map do |k|
        "#{CGI::escape(k)}=#{CGI::escape(api_params[k])}"
      end.join('&')
    end
    
    def cache_file_for(api_params)
      filename = "#{Digest::MD5.hexdigest(url_params_for(api_params))}.cache"
      File.join(@cache_folder, filename)
    end
    
    def live_response(api_params)
      api_uri = URI.parse(@url + "?#{url_params_for(api_params)}")
      response = Net::HTTP.get(api_uri.host, api_uri.request_uri)
      cache(api_params, response) unless @cache_disabled
      JSON.parse(response)
    end
    
    def response_to_html(response)
      response = [response] unless response.is_a? Array
      response['error'] if response.first.has_key? 'error'
      
      output = "<ul>"
      response.each do |tweet|
        time = Time.parse(tweet['created_at'])
        output += "<li>"
        output += "  <blockquote class=\"twitter-tweet\">"
        output += "    <p>#{auto_link(tweet['text'])}</p>"
        output += "    <small>#{tweet['user']['name']} (@#{tweet['user']['screen_name']})"
        output += "    <a href=\"#{TWITTER_STATUS_URL}#{tweet['id_str']}\""
          output += " data-datetime=\"#{time.iso8601}\">#{time.strftime('%e %b %y')}</a></small>"
        output += "  </blockquote>"
        output += "</li>"
      end
      output += "</ul>"
      
      output
    end
  end
  
  class GithubTag < TweetsTag
    
    REPOSITORIES_URL = "https://github.com/api/v2/json/repos/show/"
    
    def repos(context)
      @url = REPOSITORIES_URL + @text.split(/\s+/).map(&:strip).shift
      html_output_for
    end
    
    def reposnocache(context)
      @cache_disabled = true
      repos(context)
    end
    
    def html_output_for(api_params = {})
      body = "<div class=\"alert alert-error\"><strong>Oh snap!</strong> Github Repositories could not be processed.</div>"
      if response = cached_response(api_params) || live_response(api_params)
        body = response_to_html(response) || body
      end
      "<div class=\"repositories\">#{body}</div>"
    end
    
    def response_to_html(response)
      response['error'] if response.has_key? 'error'
      
      output = "<ul>"
      response['repositories'].sort_by{|repo| Time.parse(repo['pushed_at'])}.reverse!.each do |repo|
        time = Time.parse(repo['pushed_at'])
        output += "<li>"
        output += "  <blockquote class=\"github-repository\">"
        output += "    <h3>#{repo['name']}</h3>" if repo['homepage'].empty?
        output += "    <h3><a href=\"#{repo['homepage']}\">#{repo['name']}</a></h3>" unless repo['homepage'].empty?
        output += "    <p>#{repo['description']}</p>"
        output += "    <small>"
          output += "<span class=\"label label-info\">#{repo['language']}</span>" if repo['language']
          output += " <span class=\"label\">Fork</span>" if repo['fork']
        output += "    <a href=\"#{repo['url']}\""
          output += " data-datetime=\"#{time.iso8601}\">#{time.strftime('%e %b %y')}</a></small>"
        output += "  </blockquote>"
        output += "</li>"
      end
      output += "</ul>"
      
      output
    end
  end
end

Liquid::Template.register_tag('tweets', Jekyll::TweetsTag)
Liquid::Template.register_tag('tweetsnocache', Jekyll::TweetsTag)
Liquid::Template.register_tag('tweet', Jekyll::TweetsTag)
Liquid::Template.register_tag('tweetnocache', Jekyll::TweetsTag)
Liquid::Template.register_tag('repos', Jekyll::GithubTag)
Liquid::Template.register_tag('reposnocache', Jekyll::GithubTag)