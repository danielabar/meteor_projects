// docs in this collection will NOT be automatically published to client because autopublish package has been removed
// For development only, make Items global (rather than local var) so that we can add Items to collection in dev tools console
Items = new Meteor.Collection('items');

if (Meteor.isClient) {

  // Subscribe to channel published by server, category is retrieved from a reactive data store
  Meteor.autorun(function() {
    Meteor.subscribe('items', Session.get('category'));
  });

  Template.items.items = function() {
    // Will only find items that are allowed to be published on client via server publish
    return Items.find();
  };

  Template.items.nomatch = function() {
    return Items.find().fetch().length === 0;
  };

  Template.name.events({
    'keypress input': function(e, t) {
      if (e.keyCode === 13) {
        Session.set('category', e.currentTarget.value);
        e.currentTarget.value = '';
      }
    }
  })
}

// NOTE: 'items' key in publish statement is NOT RELATED to 'items' collection
// In publish context, the string is a unique key to identify the channel
if (Meteor.isServer) {
  Meteor.publish('items', function(category) {
    return Items.find({category: category});
  });
}