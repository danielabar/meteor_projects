## Structure

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

## Templates

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

### Reactive Templates

- set template values using functions
- use reactive data store - data store that updates templates whenever data changes
- Meteor collections are reactive (stored in mongodb)
- session store is also reactive (simpler than collection, just a key value system
     Session.set('title', 'Elements of Style');
     var title = Session.get('title');

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

### Template Callbacks

- can provide callback functions to be called when template is created, rendered or destroyed
- within callback, 'this' is bound to template instance

## Unit Testing

- not built into the framework
- see [laika](http://arunoda.github.io/laika/concepts.html)