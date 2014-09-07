Items = new Meteor.Collection('items');

// Returning true from any of the operations means that method is allowed
// http://docs.meteor.com/#allow
Items.allow({
  // Make sure there is a logged in user AND that they are the owner of the document
  insert: function(userId, doc) {
    return loggedInUserIsOwner(userId, doc);
  },
  update: function(userId, doc, fields, modifier) {
    return loggedInUserIsOwner(userId, doc);
  },
  remove: function(userId, doc) {
    return loggedInUserIsOwner(userId, doc);
  }
});

Items.deny({
  update: function (userId, doc, fields, modifier) {
    return fieldsContainOwner(fields);
  }
});

var loggedInUserIsOwner = function(userId, doc) {
    return (userId && doc.owner === userId);
};

var fieldsContainOwner = function(fields) {
    return (fields.indexOf('owner') > -1);
}