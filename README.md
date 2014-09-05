<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [Single Page Web Apps with Meteor](#single-page-web-apps-with-meteor)
  - [Creating a meteor application](#creating-a-meteor-application)
  - [Application Structure](#application-structure)
  - [Basic Templates](#basic-templates)
    - [Templates, Reactive Data Stores, and Events](#templates-reactive-data-stores-and-events)
    - [Template Events](#template-events)
    - [Template Callbacks](#template-callbacks)
  - [Collections](#collections)
    - [Mongo Shell](#mongo-shell)
  - [Smart Packages](#smart-packages)
    - [autopublish](#autopublish)
  - [Publishing and Subscribing with Collections](#publishing-and-subscribing-with-collections)
  - [Unit Testing](#unit-testing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Single Page Web Apps with Meteor

> Learning Meteor with TutsPlus [course](https://code.tutsplus.com/courses/single-page-web-apps-with-meteor)

[Docs](http://docs.meteor.com/)


## Creating a meteor application

  ```bash
  meteor create myapp
  cd myapp
  meteor
  ```

## Application Structure

- any js in root will be loaded in both server and client
- js in server dir is only loaded on server
- js in client dir is only loaded on client
- js files are loaded in alphabetical order by name
- deepest nested js in directories is loaded first (again directories by alphabetical name)
- exception to alpha rule: main.js is loaded last
- exception to alpha rule: any js in lib dir is loaded first
- css is loaded in client only, same rules apply as js with respect to alpha and nested
- public assets go in 'public' dir (images, favicon)
    - NOTE: js and css are NOT considered public assets in meteor

## Basic Templates

[Example1](book/book.js) | [Example2](people/people.js)

- html files will be loaded into the client according to same rules as js and css
- html files do not have html element (meteor will provide that)
- html files do not have links to css or js (meteor provides it)
- html files can have three root elements
  * `head` put in usual things that would go in head (eg: title)
  * `body` contains markup for application, could be standard html or links to templates
- if there are multiple html files, all the head tags are concatenated into one head tag, and all the body tags are concatenated into one body tag
- concatenation happens according to same rules as js and css loading
- templates are based on handlebars templating language
- to have a template appear in the html, must render it from body
- in javascript, data is made available to the tempalte
- can reference another template from within a template
- in javascript, can attach functions to templates, then use them in the template with a hash (#)

### Templates, Reactive Data Stores, and Events

- set template values using functions
- use reactive data store - data store that updates templates whenever data changes
- Meteor collections are reactive (stored in mongodb)
- session store is also reactive (simpler than collection, just a key value system, for example

  ```javascript
  Session.set('title', 'Elements of Style');
  var title = Session.get('title');
  ```

### Template Events

- pass an object literal to named template
- event callback gets access to event 'e' and template instance 't'
- for example, add keypress event to a template named 'list':

  ```javascript
  Template.list.events({
    'keypress input': function(e, t) {
      if (e.keyCode === 13) {
        var input = t.find('input');
        add(input.value); // add function defined elsewhere in the js
        input.value = '';
      }
    }
  });
  ```

In the following template 'editing' is a value available as part of Template in javascript

  ```html
  <template name="person">
    <li>
      {{#if editing}}
        <input type="text" value="{{name}}">
      {{else}}
        <span class="name">{{name}}</span>
      {{/if}}
    </li>
  </template>
  ```

  ```javascript
  Template.person.editing = function() {
    return Session.get('edit-' + this._id);
  }
  ```

### Template Callbacks

- can provide callback functions to be called when template is created, rendered or destroyed
- within callback, 'this' is bound to template instance

## Collections

[Source Code](peopleList/peopleList.js)

- access to database
- meteor built on top of mongodb
- most of syntax for working with meteor collections is extremely similar to mongodb collections

To create a new collection named "people"

  ```javascript
  var People = new Meteor.Collection('people');
  ```

When the above code is run on the server, it creates permanent storage in the mongo database.
On the client, it creates a local version of the collection, which is cached.

To populate a template with ALL documents in a collection:

  ```javascript
  Template.personList.people = function() {
    return People.find();
  }
  ```

`find()` method on collection returns mongo cursor object, which has useful methods like forEach, map, count, fetch

When `find()` is used in a template, it returns an array of documents (same as calling fetch on cursor)

### Mongo Shell

To connect to local mongo instance used by meteor. Meteor application server must be running.

  ```bash
  mongo meteor
  show dbs
  use meteor
  show collections
  ```

For example, if a meteor app creates a collection named 'people'

  ```
  db.people.find()
  ```

Updates to the collection in the mongo shell will be immediately reflected in the client

  ```
  db.people.insert({name: 'jane smith'})
  db.people.update({name: 'jane smith'}, { $set: {name: 'jane q smith'}  } )
  ```

To wipe out all the data and start fresh

  ```
  meteor reset
  ```

## Smart Packages

[Docs](http://docs.meteor.com/#usingpackages)

Encapsulated functionality that makes working with meoteor easier. Like ruby gems or npm modules.

To get a list of packages used in current project:

  ```bash
  meteor list
  ```

By default, the following packages are installed when creating a meteor application

* standard-app-packages
* autopublish
* insecure

To remove a package

  ```bash
  meteor remove autopublish
  ```

To add a package

  ```bash
  meteor add autopublish
  ```

To search for packages

  ```bash
  meteor search <searchterm>
  ```

Or [online](http://atmospherejs.com/)

Project package information is kept in a text file `.meteor/packages`
This is similar to gemfile in Ruby or package.json in Node.

### autopublish

Automatically publishes any changes in collection to all connected clients.
For a production application, would probably want to remove this, and customize the subscription preferences for clients.

## Publishing and Subscribing with Collections

[Source Code](itemsApp/itemsApp.js)

Remove autopublish package installed by default, and customize the publish and subscribe behaviour.

Server can publish on a channel, for example

  ```javascript
  if (Meteor.isServer) {
    Meteor.publish('items', function() {
      return Items.find();
    });
  }
  ```

Client can subscribe to this channel and will ONLY see items that server chose to publish

  ```javascript
  if (Meteor.isClient) {
    Meteor.subscribe('items');
    Template.items.items = function() {
      return Items.find();
    };
  }
  ```

To restrict what client sees, server could choose to only publish certain items, for example, those created by currently logged in user.

To filter data, publish callback can take an argument (or many arguments). Then client must set this argument when subscribing.

Client can also make use of autorun feature, to automatically stop and start subscriptions, if for example, the filter criteria is changing.

Pub/sub is for limiting what client reads. Has nothing to do with writes.

## The Meteor Account System

A group of packages that work together to implement user accounts.

  ```bash
  meteor add accounts-base
  meteor add accounts-password
  meteor add accounts-ui
  ```

Add login buttons template to body

  ```html
  <body>
    {{> loginButtons}}
  </body>
  ```

## Unit Testing

- not built into the framework
- see [laika](http://arunoda.github.io/laika/concepts.html)