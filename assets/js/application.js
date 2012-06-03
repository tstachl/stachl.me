/*
 * jQuery LiveTwitter 1.7.3
 * - Live updating Twitter plugin for jQuery
 *
 * Copyright (c) 2009-2011 Inge Jørgensen (@elektronaut)
 * Licensed under the MIT license (MIT-LICENSE.txt)
 *
 * $Date: 2011/10/28$
 */
/*jslint browser: true, devel: true, onevar: false, immed: false, regexp: false, indent: 2 */
/*global window: false, jQuery: false */
/*
 * Usage example:
 * $("#twitterSearch").liveTwitter('bacon', {limit: 10, rate: 15000});
 */
(function(a){a.fn.reverse||(a.fn.reverse=function(){return this.pushStack(this.get().reverse(),arguments)}),a.fn.liveTwitter=function(b,c,d){var e=this;return a(this).each(function(){var f={};if(this.twitter)f=a.extend(this.twitter.settings,c),this.twitter.settings=f,b&&(this.twitter.query=b),this.twitter.interval&&this.twitter.refresh(),d&&(this.twitter.callback=d);else{f=a.extend({mode:"search",rate:15e3,limit:10,imageSize:24,refresh:!0,timeLinks:!0,replies:!0,retweets:!1,service:!1,localization:{seconds:"seconds ago",minute:"a minute ago",minutes:"minutes ago",hour:"an hour ago",hours:"hours ago",day:"a day ago",days:"days ago"}},c),typeof f.showAuthor=="undefined"&&(f.showAuthor=f.mode==="user_timeline"?!1:!0),window.twitter_callback||(window.twitter_callback=function(){return!0}),this.twitter={settings:f,query:b,interval:!1,container:this,lastTimeStamp:0,callback:d,relativeTime:function(a){var b=Date.parse(a),c=(Date.parse(Date())-b)/1e3,d="";return c<60?d=c+" "+f.localization.seconds:c<120?d=f.localization.minute:c<2700?d=parseInt(c/60,10).toString()+" "+f.localization.minutes:c<5400?d=f.localization.hour:c<86400?d=""+parseInt(c/3600,10).toString()+" "+f.localization.hours:c<172800?d=f.localization.day:d=parseInt(c/86400,10).toString()+" "+f.localization.days,d},updateTimestamps:function(){var b=this;a(b.container).find("span.time").each(function(){var c=b.settings.timeLinks?a(this).find("a"):a(this);c.html(b.relativeTime(this.timeStamp))})},apiURL:function(){var a={},b=window.location.protocol==="https:"?"https:":"http:",c="api.twitter.com/1/",d="";this.settings.service&&(c=this.settings.service+"/api/"),this.settings.mode==="search"?(c=this.settings.service?this.settings.service+"/api/":"search.twitter.com/",d="search",a={q:this.query&&this.query!==""?this.query:null,geocode:this.settings.geocode,lang:this.settings.lang,rpp:this.settings.rpp?this.settings.rpp:this.settings.limit}):this.settings.mode==="user_timeline"||this.settings.mode==="home_timeline"?(d="statuses/"+this.settings.mode+"/"+encodeURIComponent(this.query),a={count:this.settings.limit,include_rts:this.settings.mode==="user_timeline"&&this.settings.retweets?"1":null,exclude_replies:this.settings.replies?null:"1"}):this.settings.mode==="favorites"?(d="favorites",a={id:encodeURIComponent(this.query)}):this.settings.mode==="list"&&(d=encodeURIComponent(this.query.user)+"/lists/"+encodeURIComponent(this.query.list)+"/statuses",a={per_page:this.settings.limit});var e=[];for(var f in a)a.hasOwnProperty(f)&&typeof a[f]!="undefined"&&a[f]!==null&&(e[e.length]=f+"="+encodeURIComponent(a[f]));return e=e.join("&"),b+"//"+c+d+".json?"+e+"&callback=?"},parseTweet:function(b){var c={id:b.id_str?b.id_str:b.id,text:b.text,created_at:b.created_at};this.settings.mode==="search"?c=a.extend(c,{screen_name:b.from_user,profile_image_url:b.profile_image_url}):c=a.extend(c,{screen_name:b.user.screen_name,profile_image_url:b.user.profile_image_url,created_at:b.created_at.replace(/^(\w+)\s(\w+)\s(\d+)(.*)(\s\d+)$/,"$1, $3 $2$5$4")});if(this.settings.service)c=a.extend(c,{url:"http://"+this.settings.service+"/notice/"+c.id,profile_url:"http://"+this.settings.service+"/"+b.from_user}),window.location.protocol==="https:"&&(c.profile_image_url=c.profile_image_url.replace("http:","https:"));else{c=a.extend(c,{url:"http://twitter.com/#!/"+c.screen_name+"/status/"+c.id,profile_url:"http://twitter.com/#!/"+c.screen_name});if(window.location.protocol==="https:"){var d=c.profile_image_url.match(/http[s]?:\/\/a[0-9]\.twimg\.com\/(\w+)\/(\w+)\/(.*?)\.(\w+)/i);d?c.profile_image_url="https://s3.amazonaws.com/twitter_production/"+d[1]+"/"+d[2]+"/"+d[3]+"."+d[4]:c.profile_image_url=c.profile_image_url.replace("http:","https:")}}return c},parseText:function(a){return a=a.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g,function(a){return'<a href="'+a+'" rel="external">'+a+"</a>"}),this.settings.service?(a=a.replace(/@[A-Za-z0-9_]+/g,function(a){return'<a href="http://'+f.service+"/"+a.replace(/^@/,"")+'" rel="external">'+a+"</a>"}),a=a.replace(/#[A-Za-z0-9_\-]+/g,function(a){return'<a href="http://'+f.service+"/search/notice?q?"+a.replace(/^#/,"%23")+'" rel="external">'+a+"</a>"})):(a=a.replace(/@[A-Za-z0-9_]+/g,function(a){return'<a href="http://twitter.com/#!/'+a.replace(/^@/,"")+'" rel="external">'+a+"</a>"}),a=a.replace(/#[A-Za-z0-9_\-]+/g,function(a){return'<a href="http://twitter.com/#!/search?q='+a.replace(/^#/,"%23")+'" rel="external">'+a+"</a>"})),a},renderTweet:function(a){var b='<div class="tweet tweet-'+a.id+'">';return this.settings.showAuthor?(b+='<img width="'+this.settings.imageSize+'" height="'+this.settings.imageSize+'" src="'+a.profile_image_url+'" />',b+='<p class="text"><span class="username"><a href="'+a.profile_url+'" rel="external">'+a.screen_name+"</a>:</span> "):b+='<p class="text"> ',b+=this.parseText(a.text),this.settings.timeLinks?(b+=' <span class="time">',b+='<a href="'+a.url+'" rel="external">',b+=this.relativeTime(a.created_at),b+="</a></span>"):b+=' <span class="time">'+this.relativeTime(a.created_at)+"</span>",b+="</p></div>",b},refresh:function(b){var c=this;(c.settings.refresh||b)&&a.getJSON(c.apiURL(),function(d){var f=0,g=c.settings.mode==="search"?d.results:d;a(g).reverse().each(function(){var d=c.parseTweet(this);(!c.settings.filter||c.settings.filter(this))&&Date.parse(d.created_at)>c.lastTimeStamp&&(a(c.container).prepend(c.renderTweet(d)),a(c.container).find("span.time:first").each(function(){this.timeStamp=d.created_at}),b||a(c.container).find(".tweet-"+d.id).hide().fadeIn(),c.lastTimeStamp=Date.parse(d.created_at),f+=1)}),f>0&&(a(c.container).find("div.tweet:gt("+(c.settings.limit-1)+")").remove(),c.callback&&c.callback(e,f),a(e).trigger("tweets"))})},start:function(){var a=this;this.interval||(this.interval=setInterval(function(){a.refresh()},a.settings.rate),this.refresh(!0))},stop:function(){this.interval&&(clearInterval(this.interval),this.interval=!1)},clear:function(){a(this.container).find("div.tweet").remove(),this.lastTimeStamp=null}};var g=this.twitter;this.timeInterval=setInterval(function(){g.updateTimestamps()},5e3),this.twitter.start()}}),this}})(jQuery);

window.prettyPrint && prettyPrint();

(function($) {
  if (!$) return;
  
  $(function() {
    /**
     * LIST TWEETS
     */
    $("#tweets div").liveTwitter('thomasstachl', {
      mode: 'user_timeline',
      limit: 20,
      rpp: 100,
      interval: false,
      filter: function(tweet) {
        return (tweet.in_reply_to_status_id === null &&
                  tweet.retweeted === false);
      }
    });
    
    /**
     * LIST GITHUB
     */
    $.getJSON('https://api.github.com/users/tstachl/repos?callback=?', function(resp) {
      var div = $('#github div');
      if (resp.data.length > 0) {
        div.append('<ul></ul>');
        
        $.each($(resp.data).sort('pushed_at', 'desc'), function(i, val) {
          div.find('ul').append(
            '<li>' +
              '<h4><a href="' + val['html_url'] + '">' + val['name'] + '</a></h4>' +
              '<small>' + ((val['description']) ? val['description'] : '(No description.)') + '</small>' +
            '</li>'
          );
          if (i === 9) return false;
        });
      } else {
        div.append('<p>No public repositories.</p>');
      }
    });
  });
})(jQuery);