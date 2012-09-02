---
---
class Twitter
  constructor: (options = {}) ->
    if options.sharing? and options.sharing and not $('#twitter-widgets').size()
      sharing = $ '<script>'
      sharing.attr('async', yes).attr('src', '//platform.twitter.com/widgets.js').attr('id', 'twitter-widgets')
             .appendTo $('head')
    
    return console.error 'No user defined.' unless options.user
    return console.error 'No target defined.' unless options.target
    
    if typeof options.target == 'string'
      options.target = $ options.target
    
    options = $.extend {},
      count: 10
      replies: yes
    , options
    
    for key, value of options
      @[key] = value
    
    @showTweets()
  
  prettyDate: (date) ->
    '<span>&infin;</span>' if navigator.appName == 'Microsoft Internet Explorer'
    
    say =
      just_now:    ' now'
      minute_ago:  '1m'
      minutes_ago: 'm'
      hour_ago:    '1h'
      hours_ago:   'h'
      yesterday:   '1d'
      days_ago:    'd'
      last_week:   '1w'
      weeks_ago:   'w'
    
    current = new Date().getTime() + (1 * 60000)
    date = new Date(date).getTime()
    diff = (current - date) / 1000
    day_diff = Math.floor diff / 86400
    
    '<span>&infin;</span>' if isNaN(day_diff) or day_diff < 0
    

    return day_diff == 0 && (
      diff < 60 && say.just_now ||
      diff < 120 && say.minute_ago ||
      diff < 3600 && Math.floor(diff / 60) + say.minutes_ago ||
      diff < 7200 && say.hour_ago ||
      diff < 86400 && Math.floor(diff / 3600) + say.hours_ago) ||
      day_diff == 1 && say.yesterday ||
      day_diff < 7 && day_diff + say.days_ago ||
      day_diff == 7 && say.last_week ||
      day_diff > 7 && Math.ceil(day_diff / 7) + say.weeks_ago
    
  linkifyTweet: (text, url) ->
    text = text.replace(/(https?:\/\/)([\w\-:;?&=+.%#\/]+)/gi, '<a href="$1$2">$2</a>')
               .replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>')
               .replace /(^|\W)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>'
    
    for u of url
      unless u.expanded_url
        text = text.replace new RegExp(u.url, 'g'), u.expanded_url
        text = text.replace new RegExp("#{u.url.replace(/https?:\/\//, '')}", 'g'), u.display_url
    
    text
  
  render: (data) ->
    @target.empty()
    for tweet in data
      @target.append [
        '<li>'
          '<p>'
            "<a href=\"http://twitter.com/#{@user}/status/#{tweet.id_str}\">#{@prettyDate(tweet.created_at)}</a>"
            @linkifyTweet(tweet.text.replace(/\n/g, '<br>'), tweet.entities.url)
          '</p>'
        '</li>'
      ].join ''
  
  showTweets: ->
    $.ajax
      url: "http://api.twitter.com/1/statuses/user_timeline/#{@user}.json?trim_user=true&count=#{parseInt(@count) + 20}&include_entities=1&exclude_replies=#{if @replies then '0' else '1'}"
      dataType: 'jsonp'
      cache: yes
      success: (data) =>
        @render data.slice(0, @count)
      error: (err) =>
        @target.find('li.loading').addClass('error').text "Twitter's busted!"

class Github
  constructor: (options = {}) ->
    return console.error 'No user defined.' unless options.user
    return console.error 'No target defined.' unless options.target
    
    if typeof options.target == 'string'
      options.target = $ options.target
    
    options = $.extend {},
      count: 10
      skip_forks: no
    , options
    
    for key, value of options
      @[key] = value
    
    @showRepos()
    
  render: (repos) ->
    @target.empty()
    for repo in repos
      @target.append [
        '<li>'
          "<a href=\"#{repo.url}\">#{repo.name}</a>"
          "<p>#{repo.description}</p>"
        '</li>'
      ].join ''
  
  showRepos: ->
    $.ajax
      url: "https://api.github.com/users/#{@user}/repos"
      dataType: 'jsonp'
      cache: yes
      success: (data) =>
        return unless data && data.data

        repos = []
        for repo in data.data
          continue if @skip_forks and repo.fork
          repos.push repo

        repos.sort (a, b) ->
          a = new Date(a.pushed_at)
          b = new Date(b.pushed_at)
          0 if a.valueOf() == b.valueOf()
          a > b ? -1 : 1

        repos.splice(@count) if @count
        @render repos
      error: (err) =>
        @target.find('li.loading').addClass('error').text 'Error loading repositories.'

class Facebook
  constructor: (options = {}) ->
    if options.sharing? and options.sharing and not $('#facebook-jssdk').size()
      $('body').append('<div id="fb-root">')
      window.fbAsyncInit = () ->
        FB.init
          appId      : '372711709452837' # App ID
          # channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
          status     : yes # check login status
          cookie     : yes # enable cookies to allow the server to access the session
          xfbml      : yes  # parse XFBML
      sharing = $ '<script>'
      sharing.attr('async', yes).attr('src', '//connect.facebook.net/en_US/all.js#appId=372711709452837&xfbml=1').attr('id', 'facebook-jssdk')
             .appendTo $('head')

class Google
  constructor: (options = {}) ->
    if options.sharing? and options.sharing and not $('#googleplus').size()
      sharing = $ '<script>'
      sharing.attr('async', yes).attr('src', '//apis.google.com/js/plusone.js').attr('id', 'googleplus')
             .appendTo $('head')

class @Application
  constructor: (options = {}) ->
    if options.twitter?
      new Twitter options.twitter
    if options.github?
      new Github options.github
    if options.facebook?
      new Facebook options.facebook
    if options.google?
      new Google options.google
    window.prettyPrint && prettyPrint()
    
    