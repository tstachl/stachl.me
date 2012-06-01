---
layout: page
title: Home
header: Thomas Stachl
description: Thoughts from a Developer, Artist, Blogger
group: navigation
---
{% include JB/setup %}

{% assign posts_collate = site.posts %}
{% for post in posts_collate  %}
  {% if forloop.first %}
  <div class="hero-unit">
  {% else %}
  <div>
  {% endif %}
    <h1>
      <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
    </h1>
    <p><small>&mdash; written on {{ post.date | date: "%B %e, %Y" }}</small></p>
    <p>
      {% for tag in post.tags %}
      <span class="label">{{ tag }}</span>
      {% endfor %}
    </p>
    <p class="lead">{{ post.content | strip_html | truncate: 500 }}</p>
  </div>
{% endfor %}
