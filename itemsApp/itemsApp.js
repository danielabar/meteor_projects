// docs in this collection will NOT be automatically published to client because autopublish package has been removed
Items = new Meteor.Collection('items');

if (Meteor.isClient) {
  // Client subscribes to channel published by server
  Meteor.subscribe('items');

  Template.items.items = function() {
    // Will only find items that are allowed to be published on client via server publish
    return Items.find();
  };
}

// NOTE: 'items' key in publish statement is NOT RELATED to 'items' collection
// In publish context, the string is a unique key to identify the channel
if (Meteor.isServer) {
  Meteor.publish('items', function() {
    return Items.find();
  });
}