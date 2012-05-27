---
layout: page
title: Home
header: Thomas Stachl
group: navigation
description: Thoughts from a Developer, Artist, Blogger
---
{% include JB/setup %}

<ul id="gallery" class="thumbnails">
  <li class="span8">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc7/47437_1560779935224_1107078380_3439156_1599462_n.jpg" alt="My Headshot taken in Hollywood 2010.">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc7/58490_1571971335002_1107078380_3466300_4138094_n.jpg" alt="North Hollywood Street Art">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc7/58325_1571931974018_1107078380_3466279_380041_n.jpg" alt="Los Angeles, CA - North Hollywood Station">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc7/34166_1470997570721_1107078380_3206324_3631323_n.jpg" alt="First Baptist Church of Los Angeles">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-ash4/263667_2148829956107_1107078380_4376212_7654103_n.jpg" alt="Sausolito, CA view to San Francisco">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc6/265025_2148756074260_1107078380_4376142_120292_n.jpg" alt="San Francisco, CA - Golden Gate Bridge">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc6/260010_2148758514321_1107078380_4376149_941985_n.jpg" alt="China Town - San Francisco, CA">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://a4.sphotos.ak.fbcdn.net/hphotos-ak-ash4/254284_2090079647386_1107078380_4334304_2788856_n.jpg" alt="San Francisco accross the Port">
    </a>
  </li>
  <li class="span2">
    <a href="#" class="thumbnail">
      <img src="http://sphotos.xx.fbcdn.net/hphotos-snc6/196139_1846667122225_1107078380_4009790_2142977_n.jpg" alt="Croatia, Porec at the Beach">
    </a>
  </li>
</ul>

<div class="row-fluid">
  <div class="span8">
    {% assign posts_collate = site.posts %}
    {% for post in posts_collate  %}
    
    {% if forloop.first %}
    <div class="hero-unit">
    {% else %}
    <div>
    {% endif %}
      <h1>
        {{ post.title }}
      </h1>
      <small>
        &mdash; written on {{ post.date | date: "%B %e, %Y" }}
        {% for tag in post.tags %}
        <span class="label">{{ tag }}</span>
        {% endfor %}
      </small>
      {% if forloop.first %}
      <p class="lead">{{ post.description }}</p>
      {% else %}
      <p class="lead">{{ post.content | strip_html | truncate: 500 }}</p>
      {% endif %}
      <p>
        <a href="{{ BASE_PATH }}{{ post.url }}" class="btn btn-primary btn-large">
          Learn more
        </a>
      </p>
    </div>
    {% endfor %}
  </div>
  <div class="span4">
    <h2>Recent Tweets</h2>
    {% tweetsnocache thomasstachl count=10 exclude_replies=1 %}
    <h2>Github Repositories</h2>
    {% reposnocache tstachl count=10 %}
  </div>
</div>
