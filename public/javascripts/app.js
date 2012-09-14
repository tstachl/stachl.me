(function() {
  var Facebook, Github, Google, Twitter;

  Twitter = (function() {

    function Twitter(options) {
      var key, sharing, value;
      if (options == null) {
        options = {};
      }
      if ((options.sharing != null) && options.sharing && !$('#twitter-widgets').size()) {
        sharing = $('<script>');
        sharing.attr('async', true).attr('src', '//platform.twitter.com/widgets.js').attr('id', 'twitter-widgets').appendTo($('head'));
      }
      if (!options.user) {
        return console.error('No user defined.');
      }
      if (!options.target) {
        return console.error('No target defined.');
      }
      if (typeof options.target === 'string') {
        options.target = $(options.target);
      }
      options = $.extend({}, {
        count: 10,
        replies: true
      }, options);
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.showTweets();
    }

    Twitter.prototype.prettyDate = function(date) {
      var current, day_diff, diff, say;
      if (navigator.appName === 'Microsoft Internet Explorer') {
        '<span>&infin;</span>';

      }
      say = {
        just_now: ' now',
        minute_ago: '1m',
        minutes_ago: 'm',
        hour_ago: '1h',
        hours_ago: 'h',
        yesterday: '1d',
        days_ago: 'd',
        last_week: '1w',
        weeks_ago: 'w'
      };
      current = new Date().getTime() + (1 * 60000);
      date = new Date(date).getTime();
      diff = (current - date) / 1000;
      day_diff = Math.floor(diff / 86400);
      if (isNaN(day_diff) || day_diff < 0) {
        '<span>&infin;</span>';

      }
      return day_diff === 0 && (diff < 60 && say.just_now || diff < 120 && say.minute_ago || diff < 3600 && Math.floor(diff / 60) + say.minutes_ago || diff < 7200 && say.hour_ago || diff < 86400 && Math.floor(diff / 3600) + say.hours_ago) || day_diff === 1 && say.yesterday || day_diff < 7 && day_diff + say.days_ago || day_diff === 7 && say.last_week || day_diff > 7 && Math.ceil(day_diff / 7) + say.weeks_ago;
    };

    Twitter.prototype.linkifyTweet = function(text, url) {
      var u;
      text = text.replace(/(https?:\/\/)([\w\-:;?&=+.%#\/]+)/gi, '<a href="$1$2">$2</a>').replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>').replace(/(^|\W)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');
      for (u in url) {
        if (!u.expanded_url) {
          text = text.replace(new RegExp(u.url, 'g'), u.expanded_url);
          text = text.replace(new RegExp("" + (u.url.replace(/https?:\/\//, '')), 'g'), u.display_url);
        }
      }
      return text;
    };

    Twitter.prototype.render = function(data) {
      var tweet, _i, _len, _results;
      this.target.empty();
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        tweet = data[_i];
        _results.push(this.target.append(['<li>', '<p>', "<a href=\"http://twitter.com/" + this.user + "/status/" + tweet.id_str + "\">" + (this.prettyDate(tweet.created_at)) + "</a>", this.linkifyTweet(tweet.text.replace(/\n/g, '<br>'), tweet.entities.url), '</p>', '</li>'].join('')));
      }
      return _results;
    };

    Twitter.prototype.showTweets = function() {
      var _this = this;
      return $.ajax({
        url: "http://api.twitter.com/1/statuses/user_timeline/" + this.user + ".json?trim_user=true&count=" + (parseInt(this.count) + 20) + "&include_entities=1&exclude_replies=" + (this.replies ? '0' : '1'),
        dataType: 'jsonp',
        cache: true,
        success: function(data) {
          return _this.render(data.slice(0, _this.count));
        },
        error: function(err) {
          return _this.target.find('li.loading').addClass('error').text("Twitter's busted!");
        }
      });
    };

    return Twitter;

  })();

  Github = (function() {

    function Github(options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      if (!options.user) {
        return console.error('No user defined.');
      }
      if (!options.target) {
        return console.error('No target defined.');
      }
      if (typeof options.target === 'string') {
        options.target = $(options.target);
      }
      options = $.extend({}, {
        count: 10,
        skip_forks: false
      }, options);
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.showRepos();
    }

    Github.prototype.render = function(repos) {
      var repo, _i, _len, _results;
      this.target.empty();
      _results = [];
      for (_i = 0, _len = repos.length; _i < _len; _i++) {
        repo = repos[_i];
        _results.push(this.target.append(['<li>', "<a href=\"" + repo.url + "\">" + repo.name + "</a>", "<p>" + repo.description + "</p>", '</li>'].join('')));
      }
      return _results;
    };

    Github.prototype.showRepos = function() {
      var _this = this;
      return $.ajax({
        url: "https://api.github.com/users/" + this.user + "/repos",
        dataType: 'jsonp',
        cache: true,
        success: function(data) {
          var repo, repos, _i, _len, _ref;
          if (!(data && data.data)) {
            return;
          }
          repos = [];
          _ref = data.data;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            repo = _ref[_i];
            if (_this.skip_forks && repo.fork) {
              continue;
            }
            repos.push(repo);
          }
          repos.sort(function(a, b) {
            var _ref1;
            a = new Date(a.pushed_at);
            b = new Date(b.pushed_at);
            if (a.valueOf() === b.valueOf()) {
              0;

            }
            return (_ref1 = a > b) != null ? _ref1 : -{
              1: 1
            };
          });
          if (_this.count) {
            repos.splice(_this.count);
          }
          return _this.render(repos);
        },
        error: function(err) {
          return _this.target.find('li.loading').addClass('error').text('Error loading repositories.');
        }
      });
    };

    return Github;

  })();

  Facebook = (function() {

    function Facebook(options) {
      var sharing,
        _this = this;
      if (options == null) {
        options = {};
      }
      if ((options.sharing != null) && options.sharing && !$('#facebook-jssdk').size()) {
        $('body').append('<div id="fb-root">');
        window.fbAsyncInit = function() {
          FB.init({
            appId: '372711709452837',
            status: true,
            cookie: true,
            xfbml: true
          });
          return FB.Event.subscribe('comment.create', _this.subscribe);
        };
        sharing = $('<script>');
        sharing.attr('async', true).attr('src', '//connect.facebook.net/en_US/all.js#appId=372711709452837&xfbml=1').attr('id', 'facebook-jssdk').appendTo($('head'));
      }
    }

    Facebook.prototype.subscribe = function() {
      return $.ajax({
        url: '/comment',
        type: 'POST',
        data: {
          title: $('title').text().split('-')[0].trim(),
          link: window.location.href
        }
      });
    };

    return Facebook;

  })();

  Google = (function() {

    function Google(options) {
      var sharing;
      if (options == null) {
        options = {};
      }
      if ((options.sharing != null) && options.sharing && !$('#googleplus').size()) {
        sharing = $('<script>');
        sharing.attr('async', true).attr('src', '//apis.google.com/js/plusone.js').attr('id', 'googleplus').appendTo($('head'));
      }
    }

    return Google;

  })();

  this.Application = (function() {

    function Application(options) {
      if (options == null) {
        options = {};
      }
      if (options.twitter != null) {
        this.twitter = new Twitter(options.twitter);
      }
      if (options.github != null) {
        this.github = new Github(options.github);
      }
      if (options.facebook != null) {
        this.facebook = new Facebook(options.facebook);
      }
      if (options.google != null) {
        this.google = new Google(options.google);
      }
      window.prettyPrint && prettyPrint();
      $('#archive-navbar').scrollspy({
        spy: 'scroll',
        target: '#archive-navbar',
        offset: 0
      });
    }

    return Application;

  })();

}).call(this);
