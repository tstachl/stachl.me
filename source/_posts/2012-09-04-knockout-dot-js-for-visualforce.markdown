---
layout: post
title: "Knockout.js for Visualforce"
date: 2012-09-04 12:21
comments: true
categories: Development
tags: [knockout.js, salesforce, visualforce, apex, view-binding, javascript, ajax]
---
Last week I saw an introduction video about [Knockout.js][ko] a javascript library
that shows sweet advantages on declarative bindings, automatic UI refresh, 
dependency tracking and templating.

{% youtube DnhGqcKEPiM %}

After watching this I realized how nice and easy you could bind data onto forms,
tables and whole templates. Immediately I thought about Visualforce and how this
could make it easier to create nice looking custom user interfaces utilizing either
Apex remote action or the Javascript toolkit.

My colleague a big [jQuery][jq] fan didn't seem to be convinced at all, so the
challenge was set and I knew what I had to do.

## The Challenge
For the first try run I wanted to find something simple and an editable grid showing
accounts (Twitter handles of accounts to be more precise) seemed to be easy enough.
The idea was to show the list of accounts with account name, a disabled checkbox to 
indicate whether or not an account had a Twitter handle and of course the Twitter 
handle itself which should be editable.

![A table with accounts, twitter account indicator and the twitter handle][goal]

## The fun part
So I started out with creating a Visualforce page and a controller. The only reason 
for the controller was to get a JSON encoded list of accounts and I thought that was
a fast and straight forward approach, whilst the real magic is happening in the 
Visualforce page. At least in this small example. So let's start with the controller:

{:.prettyprint .lang-java .linenums}
    public class KnockoutController
    {
      public KnockoutController()
      {}
      public String getAccountsJson()
      {
        return JSON.serialize((List<Account>)[SELECT Id, Name, TwitterHandle__c FROM Account]);
      }
    }

As you can see there is one getter for the account list and that's it. The Visualforce
page on the other hand contains 64 lines of markup and code. I think most of it is 
self explanatory but I added a few comments just in case.

{:.prettyprint .lang-html .linenums}
    <apex:page controller="KnockoutController" tabStyle="Account" >
      <apex:includeScript value="https://cdnjs.cloudflare.com/ajax/libs/knockout/2.1.0/knockout-min.js" />
      <apex:sectionHeader title="Knockout.js + Salesforce.com" subtitle="Like?" />
      
      <!-- The Template -->
      <table width="100%">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Has Twitter</th>
            <th>Twitter Handle</th>
          </tr>
        </thead>
        <tbody data-bind="foreach: accounts">
          <tr>
            <td data-bind="text: name"></td>
            <td>
              <input type="checkbox" disabled="disabled" data-bind="checked: has_twitter" />
            </td>
            <td data-bind="event: { dblclick: toggle_edit }">
              <span data-bind="visible: !is_editing(), text: twitter"></span>
              <input data-bind="visible: is_editing, value: twitter, event: { blur: toggle_edit }" />
            </td>
          </tr>
        </tbody>
      </table>

      <script>
        !function() {
          // The Account model
          function Account(options) {
            this.id = options.Id || ''
            this.name = options.Name || ''
            this.twitter = ko.observable(options.TwitterHandle__c || '')
            this.is_editing = ko.observable(false)
            
            // computed observable tells us if we have a twitter handle
            this.has_twitter = ko.computed(function() {
              return !!this.twitter()
            }, this)

            // the function to toggle between editing and viewing
            this.toggle_edit = function(account) {
              account.is_editing(!account.is_editing())
            }
          }

          // all of the magic happens in the model
          // the viewModel just holds the accounts array
          view_model = {
            accounts: ko.observableArray([])
          }

          // here we have our {!accountsJson} mapped and transformed to
          // account objects
          view_model.accounts(ko.utils.arrayMap({!accountsJson}, function(account) {
            return new Account(account)
          }))

          // last but not least we need to apply all bindings
          ko.applyBindings(view_model)
        }()
      </script>
    </apex:page>

## Conclusion
As you can see it's fairly simple to create a nice observable and dynamic user interface 
using [Knockout.js][ko]. Even-though my colleague would still tell me it's faster to build
this functionality in [jQuery][jq] (and he might even be right), this weekend I'm going
to show you why I consider Knockout.js a really good idea and how fast and straight forward
you can create a nice and clean Salesforce Ideas clone.

[ko]: http://knockoutjs.com/
[jq]: http://jquery.com/
[goal]: /images/knockoutjs_visualforce_goal.png "The goal!"