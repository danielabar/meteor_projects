<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

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
  - [The Meteor Account System](#the-meteor-account-system)
  - [Controlling Database Access](#controlling-database-access)
  - [Meteor Methods](#meteor-methods)
  - [The HTTP Smart Package](#the-http-smart-package)
  - [Sending Email](#sending-email)
    - [Using Gmail as SMTP Server](#using-gmail-as-smtp-server)
  - [Deploying Meteor Applications](#deploying-meteor-applications)
    - [Free Meteor Hosting](#free-meteor-hosting)
      - [Deploy Flags](#deploy-flags)
      - [View Logs](#view-logs)
      - [Custom Domain](#custom-domain)
    - [Other Server](#other-server)
  - [Unit Testing](#unit-testing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Single Page Web Apps with Meteor

> Learning Meteor with TutsPlus [course](https://code.tutsplus.com/courses/single-page-web-apps-with-meteor) | [Docs](http://docs.meteor.com/)

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
  meteor mongo
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

Can also login via 3rd party account. To find packages (eg: twitter, facebook)

  ```bash
  meteor search accounts
  ```

For example, to provide login via github

  ```bash
  meteor add accounts-github
  ```

Now if click 'Sign in' from app, will get a popup with instructions to configure Github login (getting app key, etc).

To only allow 3rd party logins, and not allow user to create account on the system

  ```bash
  meteor remove accounts-password
  ```

By default, meteor create account form only has email and password. But it can be customized.
Also the look and feel of the login can be customized.

To start customizing

  ```bash
  meteor remove accounts-ui
  ```

Then in accounts.html, remove `{{> loginButtons}}` and replace with your own template.

Need to handle three different states:

1. User could be logged in -> show user name and logout link
1. User could be not logged in -> present login form and option to create account
1. Logging in -> done via ajax, can show a spinner or some type of indicator to let user know login is in progress

Meteor provides variable `currentUser` to represent currently logged in user. Can check for this in templates

  ```html
  {{#if currentUser}}
  ```

[HTML](accounts/accounts.html) | [JS](accounts/accounts.js)

## Controlling Database Access

[HTML](limiting-write/limiting-write.html) | [JS](limiting-write/limiting-write.js)

Limiting client write access to collections.
By default, the `insecure` package is installed, and allows ALL write access to ALL clients.
By removing it, we now have to explicitly specify what write access is allowed.
Write access will be based on currently logged in user.

  ```bash
  meteor remove insecure
  meteor add accounts-base
  meteor add accounts-ui
  meteor add accounts-password
  meteor add underscore
  ```

In the browser console, can get the currently logged in user by running

  ```javascript
  Meteor.user();
  Meteor.userId();
  ```

Use collections' allowed and denied methods, for example

  ```javascript
  // Returning true from any of the operations means that method is allowed
  Items.allow({
    // Make sure there is a logged in user AND that they are the owner of the document
    insert: function(userid, doc) {
      return (userid && doc.owner === userid);
    },
    update: function() {

    },
    remove: function() {

    }
  });
  ```

In browser console, can now write to the `Items` collection

  ```javascript
  Items.insert({name:'two', owner: Meteor.userId()})
  ```

To update from browser console, must provide id

  ```javascript
  Items.update({_id:'NkCzcdifAac4vDwMu'}, {$set: {price: '$10.00'}})
  ```

Can also specify operations not allowed using `deny` method on collection.

## Meteor Methods

[HTML](meteor-methods/meteor-methods.html) | [JS](meteor-methods/meteor-methods.js)

By default, meteor gives clients lots of power, which is useful for rapid prototyping.
But for real application, don't want all users to have that much power.
We've lerned how to limit power using custom pub/sub on collections to limit reads, and allow/deny on collections to limit write.
But there's another way to do this.

Meteor methods are functions that are called on the client, but run on server.
Allow client to perform operations that require a lot of access, without actually giving the client those permissions.

Given that a method is defined on the server

  ```javascript
  if (Meteor.isServer) {
    Meteor.methods({
      createItem: function (text) {
        Items.insert({text: text});
      }
    });
  }
  ```

Then it can be called from the client using `call` or `apply`

  ```javascript
  Meteor.call('createItem', 'first-item');
  Meteor.apply('createItem', ['second-item']);
  ```

Value of `this` in server side methods is the method invocation object. Has some useful methods

  ```javascript
  this.userId;        // currently logged in user id
  this.isSimulation;  // see below for explanation
  ```

`Meteor.methods(...)` declaration can be made outside of `if isServer` and `if isClient` blocks.
This means methods are created both on the client and the server.
In this case, client is expected to define a stub method that will run on the client, while the "real" method runs on the server.
`this.isSimulation` will return true for method running on client code, while real execution is happening on server.

Calls from client to server can be made synchronously or asynchronously (preferred). To call asynchronously from client

  ```javascript
  Meteor.call('createItem', 'foo-item', function(err, id) {
    console.log(id)
  });
  ```

Meteor implements Node.js style callbacks, first argument is error, second is result.

## The HTTP Smart Package

[HTML](http-app/http-app.html) | [JS](http-app/http-app.js)

  ```javascript
  meteor add http
  ```

Make http call from server:

  ```javascript
  Meteor.http.call('GET', 'http://content.guardianapis.com/search?show-fields=all', {parans: {q: searchTerm}});
  ```

## Sending Email

  ```bash
  meteor add email
  ```

Then sending email from Meteor server side code is as simple as calling `Email.send(obj)`.
The only required field is `from`

  ```javascript
  Email.send({
    from: 'admin@localhost.com',
    to: to,
    // cc, bcc, replyTo
    subject: subject,
    text: text,
    // html
  });
  ```

Need to have an SMTP server setup for email to actually be sent (Meteor does not come with this).
If no SMTP server is present, `Email.send` will still run, and output the email to the console.

To send email with an SMTP server configured, start Meteor with `MAIL_URL` variable set:

  ```bash
  MAIL_URL = "smtp://USERNAME:PASSWORD@HOST:PORT" meteor
  ```

### Using Gmail as SMTP Server

| Variable      | Replacement   |
| ------------- | ------------- |
| USERNAME      | Gmail username (excluding "@gmail.com")  |
| PASSWORD      | Gmail password  |
| HOST          | smtp.gmail.com  |
| PORT          | 587             |

## Deploying Meteor Applications

### Free Meteor Hosting

Easiest way to deploy is to use Metero's free hosting service.

  ```bash
  meteor deploy myapp
  ```

Site is now deployed and available at [http://myapp.meteor.com](http://myapp.meteor.com)
To redeploy, run the same command again.

#### Deploy Flags

<dl>
  <dt>-P</dt>
  <dd>Specify a password to be used for all future deploys of this app</dd>

  <dt>-D</dt>
  <dd>Deletes the application</dd>
</dl>

#### View Logs

  ```bash
  meteor logs myapp
  ```

#### Custom Domain

Set your domain as a CNAME to url origin.meteor.com ???

### Custom Server

Meteor is just a node application, so it can be deployed on any server that can host node applications.

First bundle the application to be deployed

  ```bash
  cd myapp
  meteor bundle myapp.tar.gz
  ```

Then upload the bundled file `myapp.tar.gz` to the server where it will be deployed, and unpack it

  ```bash
  tar xzf myapp.tar.gz
  ```

The generated bundle/README contains instructions for what to install, environment variables to set, and how to start the app.

## Unit Testing

- not built into the framework
- see [velocity](https://github.com/meteor-velocity/velocity)