Items = new Meteor.Collection('items');

Meteor.methods({
  createItem: function (text) {
    if (this.isSimulation) {
      console.log('sending: ' + text + ' to the server');
    } else {
      // return id of created item
      return Items.insert({text: text, owner: this.userId});
    }
  }
});

if (Meteor.isClient) {
  Template.list.items = function() {
    return Items.find();
  };
}

if (Meteor.isServer) {
}